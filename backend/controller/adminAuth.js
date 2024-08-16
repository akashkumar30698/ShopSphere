const { newUser } = require("../model/userAuth")
const { generateAccessToken } = require("./userAuth")
const jwt = require("jsonwebtoken")
//const { io } = require("../index.js")
require("dotenv").config()

async function handleAdminLogin (req,res){
    try{
         const {secretCode,email,password} = req.body
         const protectedSecretCode = `${process.env.ADMIN_SECRET_CODE}`
        const protectedEmail = `${process.env.ADMIN_EMAIL}`
        const protectedPassword = `${process.env.ADMIN_PASSWORD}`

        if(secretCode == protectedSecretCode && email == protectedEmail && password == protectedPassword){
       //Token Validations
       const accessToken = generateAccessToken({ secretCode: secretCode, email : email, password: password});
       const refreshToken = jwt.sign({  secretCode: secretCode, email : email, password: password}, `${process.env.REFRESH_SECRET_TOKEN}`);
    

          /*
       const options = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE,
        sameSite: 'None',
        maxAge: 10 * 60 * 1000,  
       };

        */


    



       res.cookie("accessToken",accessToken)
   

       return res.json({
       message: "success",
       accessToken: accessToken,
       refreshToken: refreshToken,
       })
        
        }
         
        else{
            return res.json("failure")
        }


    }
    catch(err){
        console.log("Oops some error occured at adminAuth.js",err)
    }
}




async function handleGetVendors(req,res){
    try{
       const getVendors = await newUser.find({role: "VENDOR"})


        


       if(!getVendors || getVendors == undefined || getVendors.length == 0){
        return res.json({
            message:"failure"
        })
       }
       

       return res.json({
        getVendors
       })
    }
     catch(err){
        console.log("Some error occured",err)
     }
}

async function handleUpdateVendorStatus(req,res){
    
  
    try {

        const { id } = req.query;
        const { status } = req.body;
       

      const updatedVendor = await newUser.findByIdAndUpdate(
        id,
        { status: status }, 
        { new: true }
      );
  
      if (!updatedVendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      console.log(io)

    ///  io.emit("approvalStatus",updatedVendor.status)
  
    return  res.json({ message: "Vendor status updated",  updatedVendor });
    } catch (error) {
      console.error("Error updating vendor status:", error);
      res.status(500).json({ message: "Server error" });
    }


}






module.exports = {
    handleAdminLogin,
    handleGetVendors,
    handleUpdateVendorStatus
}