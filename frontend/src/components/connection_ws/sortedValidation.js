import React, {useState} from "react";
import api from '../../auth/api';
import DOMPurify from 'dompurify';
import RecordComponent from "./recordComponent";


function SortedValidation() {
  
    const [stateRendering, setStateRendering] = useState(false);
    const [sortedRecord, setSortedRecord] = useState([]);
    const {readTxtFile} = RecordComponent();

      
    const changeState = (value) => {
        setStateRendering(value);
    }
    const [isReversed, setIsReversed] = useState(1);
    const reversedButton = () => {
        setIsReversed(isReversed === 1 ? 2 : 1);
      }
      const reversedButtonComponent = () => {
        return(
          <>
          <div class="columns">
          <div class="column is-12">
              <div class="card">
                  <div class="card-header">
                      <div class="card-header-title">
                          <h4>Navbar</h4>
                      </div>
                  </div>
                  <div class="card-content">
                      <nav class="navbar is-light is-transparent" role="navigation" aria-label="main navigation">
                          <div class="navbar-brand">
                              <a class="navbar-item" href="https://bulma.io">
                              </a>
                              <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                                  <span aria-hidden="true"></span>
                                  <span aria-hidden="true"></span>
                                  <span aria-hidden="true"></span>
                              </a>
                          </div>
                          <div id="navbarBasicExample" class="navbar-menu">
                              <div class="navbar-start">
                                  <a class="navbar-item" onClick={reversedButton}> Sort by time </a>
                              </div>
                              <div class="navbar-end">
                                  <a href="#" class="navbar-item"><i class="fa fa-search"></i></a>
                                  <a href="#" class="navbar-item"><i class="fa fa-shopping-bag"></i></a>
                              </div>
                          </div>
                      </nav>
                  </div>
              </div>
          </div>
      </div>  
      </>
        );
    }

    const [textForm, setTextForm] = useState({
        attribute_data: "username",
        text_data: null
    });
    const sortedFormSubmit = async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append("attribute_data", textForm.attribute_data);
          formData.append("text_data", textForm.text_data);
          await api.post('http://127.0.0.1:8000/api/text_form/', formData)
          .then((response) => {
            setSortedRecord(response.data);
          });
        } catch (error) {
            alert(error.response);
        } 
    }
    const forChange = (e) => {
      setTextForm({ ...textForm, [e.target.name]: e.target.value });
    };
    const sortedFormView = () => {
      return (
        <div>
      <form className="container column is-full" onSubmit={sortedFormSubmit}>
        <div className="field">
          <div className="control">
            <div className="select">
              <select
                name="attribute_data" 
                value={textForm.attribute_data}
                onChange={forChange}
              >
                <option value="username">Sort by username</option>
                <option value="email">Sort by email</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="field">
          <div className="control">
            <textarea
              type="text"
              name="text_data"
              value={textForm.text_data}
              onChange={forChange}
              class="textarea is-primary chat"
              placeholder="Enter text..."
            />
          </div>
        </div>
        
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-primary">Search</button>
            <button type="button" className="button is-danger"  onClick={() => changeState(false)}>Return to chat</button>
          </div>
        </div>
      </form>
    </div>
      );
    }
    const renderSortedText = () => {
      return (
        <div class="container">
       <div id="app">
        <div class="container column is-full">
      <div class="section chat-area">
        {sortedRecord.map((data) => (
            <div className="card">
            <div className="card-header">
              {data.username} 
                  ||
              {data.id} - message id
               ||
              {data.time_created}
            </div>
            <div className="card-content">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.text) }} />
              {data.photo && (
                <img src={`http://localhost:8000${data.photo}`} />
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
    return {isReversed, reversedButtonComponent, sortedFormView, stateRendering, changeState, 
    renderSortedText}
}
export default SortedValidation;