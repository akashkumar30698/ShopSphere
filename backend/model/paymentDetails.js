const mongoose = require("mongoose")


const paymentDetails = new mongoose.Schema({
    userId:{
       type:String,
       required:true,
       default:"empty"
    },
    userPaymentId:{
        type:String,
        required:true,
        default:"empty"
    },
    userOrderId:{
        type:String,
        required:true,
        default:"empty"
    },
    userSignature: {
        type:String,
        required:true,
        default:"empty"
    },
    userProductPurchaseId: {
        type: [String],
        required:true,
        default:[]
    },
    productTotalAmount: {
       type:Number,
       required: true
    },
    paymentMadeBy:{
        type:String,
        required:true,
        default: "SELF"
    }

},{
    timestamps:true
})

const paymentDetail = mongoose.model("paymentDetail",paymentDetails)

module.exports = {
    paymentDetail,
}

      