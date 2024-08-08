const express = require("express")
const router = express.Router()


//Forget Password
router.post("/forgetPassword",handleForgetPassword)


//validateOTP
router.post("/validateOTP",handleValidateOTP)


//ResetPassword
router.post("/resetPassword",handleResetPassword)


module.exports = {
   router,
}