const express = require("express")
const router = express.Router()
const { handleUserLogin,handleUserSignUP,handleRefresh } = require("../controller/userAuth.js")


//home
router.get("/",(req,res)=>{
    res.json({message : "successfully connected"})
})


//Login
router.post("/login",handleUserLogin)


//SignUP
router.post("/signUP",handleUserSignUP)

    

////////////////////////////////////////////////////////////////////////////////////////////////
  
/* VENDOR ROUTES */

//Login
router.post("/vendor/login",handleUserLogin)


//SignUP
router.post("/vendor/signUP",handleUserSignUP)


//Refresh Endpoint
router.post("/refresh",handleRefresh)





module.exports = {
    router,
}