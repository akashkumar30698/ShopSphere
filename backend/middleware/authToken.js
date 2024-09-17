const jwt = require("jsonwebtoken");
const { newUser } = require("../model/userAuth");
const secretKey = process.env.ACCESS_SECRET_TOKEN; 

let getId = ""
let getExternalUser = ""

// Middleware function to decode and verify the token
async function getUserIdFromToken(req, res,next) {
   try {
      const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header

      if (!token) {
         console.log("no token executed")
         next()
         return res.json({message: "No-token-found"});
      }

      // Verify the token and extract the payload
      const decoded = jwt.verify(token, secretKey);

      // The userId should be part of the token payload
       const userIdEmail = decoded.email;

       const getIdFromDB = await newUser.findOne({email: userIdEmail})
           
       if (!userIdEmail || !getIdFromDB) {
          getId = ""
          return res.redirect(`${process.env.REACT_API_URL}/invalidToken`)
        }

        //Find Id from database
            const dbId =  getIdFromDB._id
            const UID = dbId.toHexString()
            getId = UID

            //Get Id for external user
            
            getExternalUser = "" //remove if there is existing id


            getExternalUser = UID

      // Attach userId to request for future use
     // req.userId = userId;
      next()
      
   } catch (err) {
      console.log("Token verification failed", err);
      return res.status(400).send("Invalid token.");
   }
}


function handleRevertBackId(req,res){

   return res.json({id:getExternalUser})
}


function getIdToken(){
   return getId
}

module.exports = {
   getUserIdFromToken,
   getIdToken,
   handleRevertBackId,
};
