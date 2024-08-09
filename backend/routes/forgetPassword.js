const express = require("express")
const router = express.Router()
const { handleForgetPassword,handleResetPassword,handleValidateOTP } = require("../controller/forgetPassword")

//Forget Password
router.post("/ForgetPassword",handleForgetPassword)


//validateOTP
router.post("/validateOTP",handleValidateOTP)


//ResetPassword
router.post("/ResetPassword",handleResetPassword)




////////////////////////////////////////////////////////////////////////////////////////////////////////

/* VENDOR ROUTES */ 

//Forget Password
router.post("/vendor/forgetPassword",handleForgetPassword)


//validateOTP
router.post("/vendor/validateOTP",handleValidateOTP)


//ResetPassword
router.post("/vendor/resetPassword",handleResetPassword)



module.exports = {
   router,
}