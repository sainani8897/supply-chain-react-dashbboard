import React,{ useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useAuth } from "../Auth/userAuth"
import { Navigate } from "react-router-dom";

const DefaultLayout = () => {
  
  const {user}  = useAuth();

  if (!user) {
    // console.log(user);
    return <Navigate to="/login" />;
  }
  else
    console.log(user);
  

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
