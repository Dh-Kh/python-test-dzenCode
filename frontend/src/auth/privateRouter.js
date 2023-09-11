import { Navigate } from 'react-router-dom';
import React from "react";

const PrivateRouter = ({ children }) => {
  const username = localStorage.getItem("username");
  const auth = !!username;
  if (!auth) {
    return <Navigate to="/login" replace />;
  } 
  return children;
};

export default PrivateRouter;