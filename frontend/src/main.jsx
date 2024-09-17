import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import Admin from "./components/admin.jsx"
import AdminLogin from './pages/admin/adminLogin.jsx'
import { LoginProvider } from './ContextApi/loginContext.jsx'
import VendorNavbar from './components/VendorNavbar.jsx'
import { AuthProvider } from './ContextApi/authProvider.jsx'
import VendorRequests from './pages/admin/vendorRequests.jsx'
import VendorSell from "./pages/vendor/vendorSell.jsx"
import VendorProductDetail from './pages/vendor/vendorProductDetail.jsx'
import VendorProducts from './pages/vendor/vendorProducts.jsx'
import { Provider } from 'react-redux'
import { store } from "./Redux/reduxStore.jsx"
import PaymentSuccess from './components/paymentSuccess.jsx'
import CartPage from './pages/Cart/addToCart.jsx'
import OrderAddress from './pages/address/address.jsx'
import IsAuthenthicated from './middleware/isAuthethicated.jsx'
import HashedError from './components/hashedError.jsx'
import Error from './components/error.jsx'
import SelfHashedError from './components/selfHashedError.jsx'
import Hashed from './middleware/hashed.jsx'
import PaymentMadeByOther from './components/paymentMadeByOther.jsx'
import InvalidToken from './components/invalidToken.jsx'
import PaymentMadeByFriend from './components/paymentMadeByFriend.jsx'
import AllOrders from './orderDetails/allOrders.jsx'


/*
 HOW TO ADD GOOGLE AUTH?

 INSTALL NPM PACKAGE REACT-OAUTH/GOOGLE --> GO TO GOOLE.CONSOLE.COM ----> CREATE PROJECT---> GO TO API AND SERVICES SECTION ---> FILL OUT OAUTH CONSENT SCREEN ----> GO TO CREDENTIALS---->(AUTHORIZED JAVASCRIPT ORIGINS) URL1* = http://localhost ,URL2* = http://localhost:5173----->(AUTHORIZED REDIRECT URLS)URL1* = http://localhost ,URL2* = http://localhost:5173

*/


const clientId = `${import.meta.env.VITE_GOOGLE_CLIENTID}`


ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <GoogleOAuthProvider clientId={clientId}>

      <Provider store={store}>
        <LoginProvider>
          <AuthProvider>

            <BrowserRouter>
              <Routes>

                <Route path="/">
                  <Route path="/" element={<App />} />
                  <Route path="/:userId" element={<App />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/ForgetPassword" element={<ForgetPassword />} />
                <Route path="/ResetPassword" element={<ResetPassword />} />
                <Route path="/validateOTP" element={<ValidateOTP />} />
                <Route path="/signUP" element={<SignUP />} />


                {/* VENDOR ROUTES */}
                <Route path="/">
                  <Route path="/:userId/vendor" element={<VendorNavbar />} />
                  <Route path="/:userId/vendor/approvals" element={<VendorSell />} />
                  <Route path="/:userId/vendor/sell" element={<VendorProductDetail />} />
                  <Route path="/:userId/vendor/Your-Products" element={<VendorProducts />} />
                </Route>




                <Route path="/vendor/login" element={<VendorLogin />} />
                <Route path="/vendor/signUP" element={<VendorSignUP />} />
                <Route path="/vendor/forgetPassword" element={<VendorForgetPassword />} />
                <Route path="/vendor/validateOTP" element={<VendorValidateOTP />} />
                <Route path="/vendor/resetPassword" element={<VendorResetPassword />} />

                {/* ADMIN */}

                <Route path="/:userId/admin" element={<Admin />} />
                <Route path="/admin-login" element={<AdminLogin />} />


                <Route path="/:userId/admin/vendorRequests" element={<VendorRequests />} />


                 <Route path="/:userId/paymentSuccess" element={<PaymentSuccess/>} />

                 <Route path="/:userId/paymentMadeByOther" element={<PaymentMadeByOther/>} /> 
                 <Route path="/:userId/selfHashedError" element={<SelfHashedError/>} />


                 <Route path="/:userId/cartPage" element={<CartPage/>} />

                 <Route path="/:userId/address"  element={<OrderAddress/>} />
                  
                  <Route path="/:userId/orderInitiatedByOther" element={<IsAuthenthicated/>} />
                  
                  <Route path="/login-error" element={<IsAuthenthicated/>} />


                  <Route path="/:userId/paymentMadeByFriend" element={<PaymentMadeByFriend/>} />

                  { /* All Orders */ }

                  <Route path="/:userId/yourOrders" element={<AllOrders/>} />

                  
                  {/*Error */}
                  <Route path="/error" element={<Error/>} />

                  <Route path="/:userId/hashedError" element={<HashedError/>} />
               
                  <Route path="/:userId/hashed" element={<Hashed/>} />
                 
                  <Route path="/invalidToken" element={<InvalidToken/>}  />

              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LoginProvider>


      </Provider>

    </GoogleOAuthProvider>





  </React.StrictMode>,
)
