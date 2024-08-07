import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './Login.jsx'
import Vendor from './Vendor.jsx'
import ForgetPassword from './ForgetPassword.jsx'
import ResetPassword from './resetPassword.jsx'
import ValidateOTP from './validateOTP.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';







/*
 HOW TO ADD GOOGLE AUTH?

 INSTALL NPM PACKAGE REACT-OAUTH/GOOGLE --> GO TO GOOLE.CONSOLE.COM ----> CREATE PROJECT---> GO TO API AND SERVICES SECTION ---> FILL OUT OAUTH CONSENT SCREEN ----> GO TO CREDENTIALS---->(AUTHORIZED JAVASCRIPT ORIGINS) URL1* = http://localhost ,URL2* = http://localhost:5173----->(AUTHORIZED REDIRECT URLS)URL1* = http://localhost ,URL2* = http://localhost:5173

*/






const clientId = "740594159422-hkkoi1tp4vni1ctt0e82evikv316m5j2.apps.googleusercontent.com"



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
          

      </Routes>
     </BrowserRouter>

  </GoogleOAuthProvider>
 




  </React.StrictMode>,
)
