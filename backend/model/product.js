const mongoose = require("mongoose")


const product = new mongoose.Schema({
      
     productPhoto: {
        type: String,
        required: true,
     },

     productTitle: {
        type: String,
        required: true,
     },

     productDescription: {
        type: String,
        required: true,
     },

     productPrice: {
        type: String,
        required: true,
     },
     category: {
      type:String,
      required: true
     },

     createdBy:{
        type : mongoose.Schema.Types.ObjectId, 
        ref : "newUser"                    
     }

},
{
   timestamps: true
})

const productDetail = mongoose.model("productDetail",product)


module.exports = {
    productDetail,
}