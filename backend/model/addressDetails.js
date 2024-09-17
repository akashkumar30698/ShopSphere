const mongoose = require("mongoose")


const addressDetails = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
     },
     lastName:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true
     },
     houseNo:{
        type:String,
        required:true
     },
     streetNo:{
        type:String,
        required:true
     },
     city:{
        type:String,
        required:true
     },
     state:{
        type:String,
        required:true
     },
     postalCode:{
        type: String,
        required:true
     },
     userId: {
        type:String,
        required:true,
     }

     
})


const addressDetailsToDB = mongoose.model("addressDetailsToDB",addressDetails)


module.exports = {
    addressDetailsToDB
}
