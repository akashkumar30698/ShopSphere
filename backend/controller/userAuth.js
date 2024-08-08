const { newUser } = require("../model/userAuth")
const bcrypt = require("bcrypt")




//Login
async function handleUserLogin(req, res) {
  const { email, password } = req.body





  return res.json("success")
}

//Sign UP
async function handleUserSignUP(req, res) {


  try {


    //Google Sign UP
    const { given_name, googleEmail, picture, isGoogleAuth } = req.body
    const googleEmailExist = await newUser.findOne({ googleEmail })


    // Vendor SignUp
    const { gst,name, email, password, role, isApproved } = req.body

     




    if (isApproved == true && role == 'VENDOR') {

       const saltrounds = 10
       const hashedPassword = await bcrypt.hash(password,saltrounds)



      const newVendorData = {
        name:name,
        email:email,
        password:hashedPassword,
        role:role
      };

      newVendorData.gst = gst
      const vendor = new newUser(newVendorData)
      
      await vendor.save()


    }


 ////////////////////////////////////////////////////////////////////////////
    else {
      if (googleEmailExist) {
        return res.json("User already exist")
      }


      if (isGoogleAuth == true) {

        const saltrounds = 10
        const auth = process.env.GOOGLE_AUTH
        const hashedPassword = await bcrypt.hash(auth, saltrounds)


        const newUserData = {
          name:given_name,
          email:googleEmail,
          password: hashedPassword,
          picture:picture
        }
 
        delete newUserData.gst
         const user =  new newUser(newUserData)
         await user.save()

        return res.json("success");


      }

      else if (isGoogleAuth == false || isGoogleAuth == null || !isGoogleAuth) {

        const { name, email, password } = req.body
        const userExist = await newUser.findOne({ email })

        if (userExist) {
          return res.json("user already exists")
        }


        const saltrounds = 10
        const hashedPassword = await bcrypt.hash(password, saltrounds)


        const newRegularUserData = {
          name:name,
          email:email,
          password: hashedPassword,
        }
 
          delete newRegularUserData.gst
           const regularUser =  new newUser(newRegularUserData)
          await regularUser.save()


        return res.json("success")

      }
    }



  }
  catch (err) {
    console.log("Some error occured at userAuth.js", err)
  }




}



module.exports = {
  handleUserLogin,
  handleUserSignUP,
}