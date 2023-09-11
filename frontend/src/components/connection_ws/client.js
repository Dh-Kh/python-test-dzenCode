import React, {useState, useEffect} from "react";
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import CaptchaComponent from "./captchaComponent"; 
import SortedValidation from "./sortedValidation";
import RecordComponent from "./recordComponent";
import "./style_ws.css"


function WebSocketComments() {
    const socket = new W3CWebSocket(
      `ws://127.0.0.1:8000/ws/comments/?jwt_token=${localStorage.getItem("access")}`);
    const [textData, setTextData] = useState("");
    const [imgData, setImgData] = useState(null);
    const [txtData, setTxtData] = useState(null);
    const [page, setPage] = useState(1);
    const {formInputRender , CaptchaSubmit, FrontendCaptcha, inputValueState, tokenCaptcha, setInputValueState, 
    setTokenCaptcha} = CaptchaComponent();
    const {isReversed, reversedButtonComponent, sortedFormView, stateRendering, changeState, 
    renderSortedText} = SortedValidation();
    const {recordData, recordID, setRecordID, removeReply, recordForm, recordFields} = RecordComponent();
    useEffect(() => {
      recordFields(isReversed, page);
    }, [isReversed, page, formInputRender, imgData, txtData])
    useEffect(() => {
        socket.onopen = () => {
          console.log("Connection established");
        };
        socket.onclose = (event) => {
          console.log("Socket closing", event.reason);
        };
        socket.onmessage = (e) => {
          const data = JSON.parse(e.data);
          setTextData((prevData) => [...prevData, data.text]);
          setImgData(data.photo);   
          setTxtData(data.txt_file);
          console.log("data is received");
        };
        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
        return () => {
            if (socket.readyState === 1) {
              socket.close();
            }
        };
    }, []);
    
    const socketSendData = (related_record, text, related_photo, input_value, token_captcha, txt_file) => {
        const data = {
          text: text,
          input_value: input_value,
          token_captcha: token_captcha,
          txt_file: txt_file
        };
        if (related_record !== null) {
          data.related_record = related_record;
        }
        if (related_photo instanceof Blob) { 
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = e.target.result;
            data.photo = imageData;
            socket.send(JSON.stringify(data));
          };
          reader.readAsDataURL(related_photo);
        } else {
          socket.send(JSON.stringify(data));
      }
    };

    
    const frontendSendData = () => {
        socketSendData(recordID, textData, imgData, inputValueState, tokenCaptcha, txtData);
        setRecordID(null);
        setTextData("");
        setImgData(null);
        setInputValueState(null);
        setTokenCaptcha(null);
        setTxtData(null);
    }

    const addText = (value) => {
        setTextData((input_text) => input_text + " " + value)
    }
    const formInput = () => {
      return(
        <form onSubmit={CaptchaSubmit} class="container column is-full">        
                <div class="section chat-area">
                {recordID !== null && (
                  <span onClick={removeReply}>Reply form</span>
                )}
                <textarea
                  value={textData}
                  onChange={(e) => setTextData(e.target.value)}
                  class="textarea is-primary chat"
                />
        <div className="button-panel">
          <button
            type="button"
            className="button"
            onClick={() => addText('<a></a>')}
          >
          Links
          </button>
          <button
            type="button"
            className="button"
            onClick={() => addText('<code></code>')}
          >
            Code
          </button>
          <button
            type="button"
            className="button"
            onClick={() => addText('<i></i>')}
          >
            i tag
          </button>
          <button
            type="button"
            className="button"
            onClick={() => addText('<strong></strong>')}
          >
            strong tag
          </button>
          <input class="button" type="file" accept=".txt" onChange={(e) => {
              const fileInput = e.target.files[0];
              if (fileInput) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileData = e.target.result;
                    setTxtData(fileData); 
              };
              reader.readAsDataURL(fileInput);
              }
          }} placeholder="Rounded input">
          </input>
          <span>for .txt files</span>
        </div>
                <input
                  type="file"
                  onChange={(e) => {
                    setImgData(e.target.files[0]);
                  }}
                  className="button is-info"
                />
                <button type="button" className="button is-danger" onClick={() => changeState(true)} >Sort email-username</button>
                {FrontendCaptcha(frontendSendData)}
                </div>
          </form>
      )
    }
    return (
      <div class="container">
            <div id="app">
                {reversedButtonComponent()}
                {stateRendering === false ? recordForm() : renderSortedText()}
                {stateRendering === false ? formInput() : sortedFormView()}
                <div className="pagination is-centered">
                <button
                  className="pagination-previous button"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                {Array.isArray(recordData.results) && (
                    <button
                      className="pagination-next button"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= Math.ceil(recordData.results.length / 25)}
                    >
                      Next
                    </button>
                  )}
              </div>
            </div>
            </div>
            
    );
  }
  
  export default WebSocketComments;