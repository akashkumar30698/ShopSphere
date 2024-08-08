import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import Vendor from './pages/vendor/Vendor.jsx'
import ForgetPassword from './pages/forgetPassword/ForgetPassword.jsx'
import ResetPassword from './pages/forgetPassword/resetPassword.jsx'
import ValidateOTP from './pages/forgetPassword/validateOTP.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUP from './pages/signUP/signUP.jsx'






/*
 HOW TO ADD GOOGLE AUTH?

 INSTALL NPM PACKAGE REACT-OAUTH/GOOGLE --> GO TO GOOLE.CONSOLE.COM ----> CREATE PROJECT---> GO TO API AND SERVICES SECTION ---> FILL OUT OAUTH CONSENT SCREEN ----> GO TO CREDENTIALS---->(AUTHORIZED JAVASCRIPT ORIGINS) URL1* = http://localhost ,URL2* = http://localhost:5173----->(AUTHORIZED REDIRECT URLS)URL1* = http://localhost ,URL2* = http://localhost:5173

*/






const clientId = "740594159422-7pgrs51mlvr2ni5f6000mdu4550limqv.apps.googleusercontent.com"



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
  <GoogleOAuthProvider clientId={clientId}>

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="/login"  element={<Login/>}    />
         <Route path="/vendor"  element={<Vendor/>}   />
         <Route path="/forgetPassword"  element={<ForgetPassword/>}/>
          <Route path="/resetPassword"  element={<ResetPassword/>} />
          <Route path="/validateOTP"    element={<ValidateOTP/>} />
           <Route path="/signUP" element={<SignUP/>} />

      </Routes>
     </BrowserRouter>

  </GoogleOAuthProvider>
 




  </React.StrictMode>,
)
