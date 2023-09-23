import React from "react"
import {useForm} from "react-hook-form"
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./style_user.css"


function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try {
            const response_login = await axios.post("http://localhost:8000/api/login_model/", data)
            if (response_login.status === 200) {
                console.log("I am here");
                const { access, refresh } = await response_login.data;
                localStorage.setItem('access', access);
                localStorage.setItem('refresh', refresh);
                try {
                  navigate("/home_page");
                } catch (error) {
                    console.error("Navigation error:", error);
                }
            } else {
                console.log(response_login.status);
            }
        } catch (error) {
            console.error(error.response);
        }
    }
    return (
        <section className="hero is-primary is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                <form onSubmit={handleSubmit(onSubmit)} className="box">
                  <div className="field">
                    <label htmlFor="username" className="label">Username</label>
                    <div className="control has-icons-left">
                      <input
                        type="text"
                        id="username"
                        name="username" 
                        placeholder=" john doe"
                        className={`input ${errors.username ? 'is-danger' : ''}`}
                        {...register('username', { required: 'Username is required' })}
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-envelope"></i>
                      </span>
                    </div>
                    {errors.username && <p className="help is-danger">{errors.username.message}</p>}
                  </div>
  
                  <div className="field">
                    <label htmlFor="password" className="label">Password</label>
                    <div className="control has-icons-left">
                      <input
                        type="password"
                        id="password"
                        name="password" 
                        placeholder="*******"
                        className={`input ${errors.password ? 'is-danger' : ''}`}
                        {...register('password', { required: 'Password is required' })}
                      />
                      <span className="icon is-small is-left">
                        <i className="fa fa-lock"></i>
                      </span>
                    </div>
                    {errors.password && <p className="help is-danger">{errors.password.message}</p>}
                  </div>
                  <div className="field">
                    <button className="button is-success" type="submit">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>    
    );
    
}
export default LoginForm;