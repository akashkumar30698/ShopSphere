const mongoose = require("mongoose")


const addToCartDetails = new mongoose.Schema({
      userId: {
        type: String,
        required: true,
        Unique: true,
      },
      productId: {
        type: String,
        required: true,
        default: "empty"
      },
      productPhoto: {
        type: String,
        required: true,
        default: "empty"
      },
      productTitle: {
        type: String,
        required: true,
        default: "empty"
      },
      productPrice: {
        type: String,
        required: true,
        default: "empty"
      },
      productQuantity: {
        type:Number,
        required:true
      }

})


const addToCart = mongoose.model("addToCart",addToCartDetails)

module.exports = {
    addToCart,
}