import React from "react";
import { useNavigate  } from 'react-router-dom';

function LogOut() {
    const navigate = useNavigate();
    const handleLogOut = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate("/login");
    }
    return(
    <div>
        <button className="button is-primary is-rounded is-size-7" onClick={handleLogOut}>Logout</button>
    </div>    
    );
}
export default LogOut;