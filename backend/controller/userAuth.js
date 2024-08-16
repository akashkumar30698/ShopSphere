const { newUser } = require("../model/userAuth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { io } = require("../socketConnect")
require("dotenv").config()


//Login
async function handleUserLogin(req, res) {
 
 try{
  //Google Auth Login or SignUP(If not exists)
 const {given_name,googleEmail,picture,isGoogleAuth} = req.body


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



       res.cookie("accessToken",accessToken)
   

       return res.json({
       message: "success",
       accessToken: accessToken,
       refreshToken: refreshToken,
       params:userId
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

     res.cookie("accessToken",accessToken)
   

     return res.json({
      message: "success",
      accessToken: accessToken,
      refreshToken: refreshToken,
      params: userIdAuth
     })
              



   }

   else{


    //Regular login
    const { email, password } = req.body
    const findEmail = await newUser.findOne({email})

     if(!findEmail || findEmail == null){
      return res.sendStatus(401).json("failure")
     }
     
     const hashedPassword = findEmail.password


     const match = await bcrypt.compare(password,hashedPassword)

     if(!match || match == null){
       throw new ApiError(403).json("failure")
     }

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
  


       const findGst =  findEmail.gst || {}
        

       // Sending Additional details to frontend If role == 'VENDOR'
       if(findGst || findEmail != null){
         return res.json({
          message: "success",
          accessToken: accessToken,
          refreshToken: refreshToken,
          params: regularUserId,
          gst: findEmail.gst,
          name:findEmail.name,
          email: findEmail.email
          })
                 

       }
      
        return res.json({
        message: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
        params: regularUserId
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
      console.log(user)
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
  return jwt.sign(user,`${process.env.ACCESS_SECRET_TOKEN}`, { expiresIn: '10m' });
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

        await newUser.create({
          name:name,
          email:email,
          password:hashedPassword,
          role:role,
          gst:gst
        
        })

        io.emit("message",newUser)


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



module.exports = {
  handleUserLogin,
  handleUserSignUP,
  handleRefresh,
  generateAccessToken,
}