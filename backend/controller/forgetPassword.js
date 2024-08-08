const { newUser } = require("../model/userAuth")


//Store email
let storeEmail = null

// Generate OTP
function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
    return otp.toString();
  }
  
  //Stores Otp for temporary time
  let storeOTP = 0
  
  
  
  
  // Nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'niteshsagar312004@gmail.com',//senders mail
        pass: `${process.env.NODEMAILER_PASS}` //You have to manually generate this. Go to gmail > click on profile picture > manage your google account > security > turn on 2 step authenthication > go to search bar > search app passwords > code is generated
    }
  });
  


  //Forget Password
async function handleForgetPassword(req,res) {

       try{
        const { email,role} = req.body
        const exist =   await newUser.findOne({email,role})

     if(!exist || exist == null){
            return res.json("failure")
     }




      if(role == 'USER' || role == 'VENDOR'){
            
        storeEmail = email




        const otp = generateOTP();
       
        const mailOptions = {
            from: 'niteshsagar312004@gmail.com', //Same sender email
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error)
                return res.status(500).send({ error: 'Failed to send OTP' });
            }
     
            storeOTP = parseInt(otp)
          
          return   res.status(200).json("success");
        });


      }


       }
       catch(err){
        console.log("some error occured ",err)
       }
}




//Validate OTP
 async function handleValidateOTP(req,res){
    try{
      
       const{ otp } = req.body
       if(storeOTP == otp){
        return res.json("success")
       }



    }
    catch(err){
        console.log("Oops some error occured",err)
    }
 }


//Reset Password 
async function handleResetPassword(req,res){
    try{
        const {email,password,confirmPassword,role} = req.body

        if(email != storeEmail || password != confirmPassword){
              return res.json("failure")
        }
        
        const saltrounds = 10
        const hashedPassword = await bcrypt.hash(password,saltrounds)


        await newUser.findOneAndUpdate({email : email,
            role: role,
        },
        { $set : {password : hashedPassword}},
        {new: true}
        )

     return res.json("success")


    }
    catch(err){
        console.log("Some error occured ",err)
    }
}







module.exports = {
    handleForgetPassword,
    handleValidateOTP,
    handleResetPassword,
}