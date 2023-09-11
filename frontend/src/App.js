import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from "react";
import HomePage from "./components/auth_user/home_page";
import LoginForm from "./components/auth_user/login";
import RegisterForm from "./components/auth_user/register";
import LogOut from "./components/auth_user/logout";
import WebSocketComments from "./components/connection_ws/client";
import PrivateRoute from "./auth/privateRouter";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/home_page" element={<PrivateRoute>
             <HomePage />
        </PrivateRoute>} />
      <Route path="/login" element={
          <LoginForm />
      } />
      <Route path="/register" element={
          <RegisterForm />
      } />
      <Route path="/logout" element={
          <LogOut />
      } />
      <Route path="/comments" element={
          <WebSocketComments />
      } />
      </Routes>
    </Router>
  );
}

export default App;
