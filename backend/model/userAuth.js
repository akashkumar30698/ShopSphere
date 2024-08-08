const mongoose = require("mongoose")


const user = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        Unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    role : {          
        type : String,
        enum : ["USER","VENDOR","ADMIN"],
        default : "USER",

    },
    profileImageURL : {
        type : String,
        default :"https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar.png",
    },
   


},
{
   timestamps : true, 
}
)


const newUser = mongoose.model("newUser",user)


module.exports = {
    newUser,
}