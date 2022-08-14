import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {
   
    const token = localStorage.getItem("token");
    const auth = ( token != null ) ? true : null ;

    console.log("gooo",token);

    // If has token, return outlet in other case return navigate to login page

    return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthGuard