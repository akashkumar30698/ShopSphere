const { newUser } = require("../model/userAuth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { io } = require("../socketConnect")
//const { passFrontendHashed } = require("./addToCart")
require("dotenv").config()

let initialVendorStatus = ""

let googleUserId = ""
let normalUserId = ""

let googleHash = ""
let regularHash = ""

//Login
async function handleUserLogin(req, res) {
 
 try{
  //Google Auth Login or SignUP(If not exists)
 const {given_name,googleEmail,picture,isGoogleAuth ,isHashedGoogle} = req.body


  if(isGoogleAuth == true){

    const googleEmailExist = await newUser.findOne({email: googleEmail })
  
    if(googleEmailExist){
           
       //Token Validations
       const accessToken = generateAccessToken({ name: googleEmailExist.name, email: googleEmailExist.email});
       const refreshToken = jwt.sign({ name: googleEmailExist.name, email: googleEmailExist.email}, `${process.env.REFRESH_SECRET_TOKEN}`);
    
          /*
       const options = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE,
        sameSite: 'None',
        maxAge: 10 * 60 * 1000,  
       };

        */

        const userId = googleEmailExist._id
          
        googleUserId = ""
        googleHash = ""

        if(isHashedGoogle){
        //  googleHash = passFrontendHashed()
            googleUserId = userId.toHexString()
        }

        res.cookie("accessToken",accessToken)
   
       return res.json({
       message: "success",
       accessToken: accessToken,
       refreshToken: refreshToken,
       params:userId,
     //  otherHash: googleHash
       })

    }
  
     const saltrounds = 10
     const auth = process.env.GOOGLE_AUTH
     const hashedPassword = await bcrypt.hash(auth, saltrounds)
  
      const googleAuthUser =  await newUser.create({
        name: given_name,
        email: googleEmail,
        password : hashedPassword,
        picture: picture
 
      })
     
     //Token Validations
     const accessToken = generateAccessToken({ name: googleAuthUser.name,email: googleAuthUser.email});
     const refreshToken = jwt.sign({ name: googleAuthUser.name,email: googleAuthUser.email}, `${process.env.REFRESH_SECRET_TOKEN}`);
    
     /*
     const options = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: 'None',
      maxAge: 10 * 60 * 1000,  
     };

     */

     const userIdAuth = googleAuthUser._id

       googleUserId = ""
       googleHash = ""
     if(isHashedGoogle){
     // googleHash = passFrontendHashed()
      googleUserId =  userIdAuth.toHexString()
     }

     res.cookie("accessToken",accessToken)
   
      return res.json({
      message: "success",
      accessToken: accessToken,
      refreshToken: refreshToken,
      params: userIdAuth,
     // otherHash:googleHash
      })
              
   }

   else{


    //Regular login
    const { isHashedRegular } = req.body

    
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password

    const findEmail = await newUser.findOne({email})

     if(!findEmail || findEmail == null){
      return res.status(401).json({message: "not-found"})
     }
     
     const hashedPassword = findEmail.password

     const match = await bcrypt.compare(password,hashedPassword)

     if(!match || match == null){
      return res.status(403).json({message: "failure"})
     }


         initialVendorStatus = findEmail.status
     
          //Token Validations
          const accessToken = generateAccessToken({ name: findEmail.name,email: findEmail.email});
          const refreshToken = jwt.sign({ name: findEmail.name,email: findEmail.email}, `${process.env.REFRESH_SECRET_TOKEN}`);
         
     
     /*
     const options = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: 'None',
      maxAge: 10 * 60 * 1000,  
     };

     */

       res.cookie("accessToken",accessToken)

       const regularUserId = findEmail._id

       normalUserId = ""

       regularHash = ""


       if(isHashedRegular){
      //  regularHash = passFrontendHashed()
        normalUserId = regularUserId.toHexString()
       }

 
       const findRole =  findEmail.role || {}
        
       
       // Sending Additional details to frontend If role == 'VENDOR'
       if(findRole === "VENDOR"){
        
         return res.json({
          message: "vendor",
          accessToken: accessToken,
          refreshToken: refreshToken,
          params: regularUserId, 
          })    
       }
      
        return res.json({
        message: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
        params: regularUserId,
     //   otherHash:regularHash
        })
              
   }
  
 }
 catch(err){
  console.log("Oops some error occured",err)
 }
 
}




//Refresh Endpoint

async function handleRefresh(req,res){

  const {googleAuthName,googleAuthEmail,isGoogleAuth,refreshToken} = req.body

  if(isGoogleAuth == true){

    //Verify Refersh Token
    jwt.verify(refreshToken,`${process.env.REFRESH_SECRET_TOKEN}`, (err, user) => {
      if (err) return res.sendStatus(403).json("failure");
      const accessToken = generateAccessToken({name : googleAuthName,
                                            email : googleAuthEmail});
  
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
     })
              
    })
  
  }else{

    const {name,email,refreshToken} = req.body

       //Verify Refersh Token

       jwt.verify(refreshToken,`${process.env.REFRESH_SECRET_TOKEN}`,(err,user)=>{
           if(err) return res.sendStatus(403).json('failure');

              const accessToken = generateAccessToken({name : name,
              email : email})
    

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
              })
   })
       
  }


}




//Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(user,`${process.env.ACCESS_SECRET_TOKEN}`);
};




//Sign UP
async function handleUserSignUP(req, res) {

  try {

    // Vendor SignUp
    const { gst,name, email, password, role } = req.body

    if ( role == 'VENDOR') {

        const vendorExist = await newUser.findOne({ email })

        if(vendorExist){
          return res.sendStatus(401).json("failure")
        }


       const saltrounds = 10
       const hashedPassword = await bcrypt.hash(password,saltrounds)

        const user =   await newUser.create({
          name:name,
          email:email,
          password:hashedPassword,
          role:role,
          gst:gst
        })

        initialVendorStatus = user.status

        io.emit("message",user)


      return res.json("success")

    }


 ////////////////////////////////////////////////////////////////////////////


    else {
    

        const { name, email, password } = req.body
        const userExist = await newUser.findOne({ email })

        if (userExist) {
          return res.sendStatus(401).json({
            message : "already-exists"
          })
          
        }

        const saltrounds = 10
        const hashedPassword = await bcrypt.hash(password, saltrounds)

         await newUser.create({
          name:name,
          email:email,
          password: hashedPassword,     
         })

           return res.json("success")   
    }
  }

  catch (err) {
    console.log("Some error occured at userAuth.js", err)
  }

}



function VendorInitialStatus(){
  return initialVendorStatus
}


function PassUserIds(){
  return {googleUserId,normalUserId}
}




module.exports = {
  handleUserLogin,
  handleUserSignUP,
  handleRefresh,
  generateAccessToken,
  VendorInitialStatus,
  PassUserIds,
}