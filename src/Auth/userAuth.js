import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./user";
import axios from "axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  /*  const [user, setUser] = useState({
     _id:"23321321",
     name:"sainath",
     age:26
   });
   console.log(user);
   const navigate = useNavigate();
 
   // call this function when you want to authenticate the user
   const login = async (data) => {
     setUser(data);
     navigate("/profile");
   };
 
   // call this function to sign out logged in user
   const logout = () => {
     setUser(null);
     navigate("/", { replace: true });
   };
 
   const value = useMemo(
     () => ({
       user,
       login,
       logout
     }),
     [user]
   ); */
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
}


/* Use Provider Aut */
function useProvideAuth() {
  
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  let userData = null;
  
  

  // console.log(useLocalStorage('user',null));
  const [user, setUser] = useLocalStorage('user',userData);
  
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (data) => {
    return axios.post(baseUrl + "/login", data)
      .then(({ data }) => {
        const token = "Bearer " + data.token
        // setToken(token);
        console.log(data);
        setUser(data.user);
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setVisible(true);
      })
  };

  const signup = (email, password) => {
    return { user: "email", password: "q12112" };
  };
  const signout = () => {
    // return setUser(false)
    console.log("logout was called");
    return axios.post(baseUrl + "/logout", data)
      .then(({ data }) => {
        const token = "Bearer " + data.token
        // setToken(token);
        console.log(data);
        setUser(false);
        localStorage.removeItem("token");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        // setVisible(true);
      })
  };
  const sendPasswordResetEmail = (email) => {
    return true;
  };
  const confirmPasswordReset = (code, password) => {
    return true
  };

  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
}