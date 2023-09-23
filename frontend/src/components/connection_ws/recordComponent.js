import React, {useEffect, useState} from "react";
import api from '../../auth/api';
import DOMPurify from 'dompurify';
import "./style_ws.css"


function RecordComponent() {
    
    const [recordData, setRecordData] = useState([]);
    const [recordID, setRecordID] = useState(null);
    const [imageDisplay, setImageDisplay] = useState(null);
    const recordClick = (e) => {
        setRecordID(e);
    }

    const removeReply = () => {
        setRecordID(null);
    }
    const readTxtFile = (value) => {
      if (value) {
        fetch(`http://localhost:8000/${value}`)
          .then((response) => response.text())
          .then((data) => alert(data))
          .catch((error) => console.error(error));
      }
    }
    const recordForm = () => {
          return (
            <div class="container">

           <div id="app">
            <div class="container column is-full">
          <div class="section chat-area">
            {Array.isArray(recordData.results) && recordData.results.map((data) => (
                  <div className="card" key={data.id} onClick={() => recordClick(data.id)}>
                    <div className="card-header">
                      {data.username} 
                          ||
                      {data.id} - message id
                       ||
                      {data.time_created}
                    </div>
                    <div className="card-content" key={data.id} onClick={() => recordClick(data.id)}>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text) }} />
                      {data.photo && (
                        <img src={`${data.photo}`} />
                       )}
                    </div>
                    <div>
                    {data.root_record !== null && (
                        <span>Reply on: {data.root_record}</span>
                    )}
                    </div>
                    <div>
                    {data.txt_file !== null && (
                        <span onClick={() => {
                            readTxtFile(data.txt_file)
                        }}>Txt file: click to display</span>
                    )}
                    </div>
                  </div>
            ))}
          </div>
          </div>
          </div> 
          </div>
          )
      }

      const recordFields = async (value, page_n) => {
        try {
            const response = await api.get(`http://localhost:8000/api/record_fields/${value}/?page=${page_n}`);
            setRecordData(response.data);
        } catch (error) {
          console.error("Error fetching record data:", error);
        }
      };
      return {recordData, recordID, setRecordID, removeReply, recordForm, recordFields, readTxtFile}

}
export default RecordComponent;