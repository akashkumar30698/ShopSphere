import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './pages/login/Login.jsx'
import ForgetPassword from './pages/forgetPassword/ForgetPassword.jsx'
import ResetPassword from './pages/forgetPassword/resetPassword.jsx'
import ValidateOTP from './pages/forgetPassword/validateOTP.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUP from './pages/signUP/signUP.jsx'
import VendorSignUP from './pages/vendor/signUP.jsx'
import VendorLogin from './pages/vendor/login.jsx'
import VendorForgetPassword from './pages/vendor/forgetPassword.jsx'
import VendorResetPassword from './pages/vendor/resetPassword.jsx'
import VendorValidateOTP from './pages/vendor/validateOTP.jsx'


/*
 HOW TO ADD GOOGLE AUTH?

 INSTALL NPM PACKAGE REACT-OAUTH/GOOGLE --> GO TO GOOLE.CONSOLE.COM ----> CREATE PROJECT---> GO TO API AND SERVICES SECTION ---> FILL OUT OAUTH CONSENT SCREEN ----> GO TO CREDENTIALS---->(AUTHORIZED JAVASCRIPT ORIGINS) URL1* = http://localhost ,URL2* = http://localhost:5173----->(AUTHORIZED REDIRECT URLS)URL1* = http://localhost ,URL2* = http://localhost:5173

*/


const clientId = `${import.meta.env.VITE_GOOGLE_CLIENTID}`


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
  
  <GoogleOAuthProvider clientId={clientId}>

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="/login"  element={<Login/>}    />
         <Route path="/ForgetPassword"  element={<ForgetPassword/>}/>
         <Route path="/ResetPassword"  element={<ResetPassword/>} />
         <Route path="/validateOTP"    element={<ValidateOTP/>} />
         <Route path="/signUP" element={<SignUP/>} />

         {/* VENDOR ROUTES */}

         <Route path="/vendor/login" element={<VendorLogin/>} />
         <Route path="/vendor/signUP" element={<VendorSignUP/>} />
         <Route path="/vendor/forgetPassword" element={<VendorForgetPassword/>} />
         <Route path="/vendor/validateOTP" element={<VendorValidateOTP/>}  />
         <Route path="/vendor/resetPassword" element={<VendorResetPassword/>} />




      </Routes>
     </BrowserRouter>

  </GoogleOAuthProvider>
 




  </React.StrictMode>,
)
