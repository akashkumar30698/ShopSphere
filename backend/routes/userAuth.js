const express = require("express")
const router = express.Router()
const { handleUserLogin,handleUserSignUP } = require("../controller/userAuth.js")






//home
router.get("/",(req,res)=>{
    res.json({message : "successfully connected"})
})




//Login
router.post("/login",handleUserLogin)


//SignUP
router.post("/signUP",handleUserSignUP)

    







module.exports = {
    router,
}