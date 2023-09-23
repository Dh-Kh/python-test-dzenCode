import React, {useState, useEffect} from "react";
import "./style_user.css"
import api from '../../auth/api';
import { Link } from 'react-router-dom';
import LogOut from "./logout";

function HomePage() {
    const [userObject, setUserObject] = useState([]);
    useEffect(() => {
        api.get('http://localhost:8000/api/display_model/')
      		.then(response => {
        		setUserObject(response.data);
      		})
      		.catch(error => {
        		console.log(error);
            });
    }, [])
    console.log(userObject.id);
    return(
    <section className="hero is-primary is-fullheight" style={{ backgroundColor: "#eee" }}>
    <div className="hero-body">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-12-mobile is-4-desktop is-4-tablet">
            <div className="card" style={{ borderRadius: "15px" }}>
              <div className="card-content has-text-centered">
                    <h4 className="mb-2">Profile</h4>
                    <p className="text-muted mb-4">{userObject.username} <span className="mx-2">|</span>Home Page</p>
                    <Link to="/comments">
                    <button type="button" className="button is-primary is-rounded is-size-5">
                      Message now
                    </button>
                    </Link>
                    <div className="columns is-centered mt-5 mb-2">
                      <div className="column is-narrow">
                        <p className="mb-2 is-size-4">{userObject.email}</p>
                        <p className="text-muted mb-0">User email</p>
                        {<LogOut/>}
                      </div>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
    )
}
export default HomePage;