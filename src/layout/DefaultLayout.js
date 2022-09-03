import React,{ useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Navigate } from "react-router-dom";

const DefaultLayout = () => {
  
 /*  const {authed}  = useAuth();
  console.log(authed);

  if (!authed) {
    console.log(authed,"iii");
    return <Navigate to="/login" />;
  }
  else
    console.log(authed); */

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
