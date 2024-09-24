const express = require("express")
const router = express.Router()
const { handleUserLogin,handleUserSignUP,handleRefresh } = require("../controller/userAuth.js")
const { handleGetLatestVendorStatus } = require("../controller/adminAuth.js")
const { handleAddVendorProduct,handleVendorYourProducts,handleDeleteProduct,handleGetAllProducts } = require("../controller/vendorAddProduct.js")
const { handleUserPaymentCheckOut,handlePaymentVerification } = require("../controller/paymentCheckOut.js")
const { uploadFiles } = require("../multer/multer.js")
const { getUserIdFromToken ,handleRevertBackId } = require("../middleware/authToken.js")



//home
router.get("/",(req,res)=>{
    res.json({message : "successfully connected"})
})


//Login
router.post("/login",handleUserLogin)

//SignUP
router.post("/signUP",handleUserSignUP)

//All Products
router.get("/all-products",handleGetAllProducts)
   
//Product Payment CheckOut
router.post("/:userId/checkout",handleUserPaymentCheckOut)

//Verification
router.post("/:userId/paymentVerification",handlePaymentVerification)

//GetUserId
router.get("/getUserId",getUserIdFromToken,handleRevertBackId)


//PassCurrentUserId
//router.get("/:userId/passCurrentUserId",handlePassCurrentUserId)



////////////////////////////////////////////////////////////////////////////////////////////////
  
/* VENDOR ROUTES */

//Login
router.post("/vendor/login",handleUserLogin)


//SignUP
router.post("/vendor/signUP",handleUserSignUP)


//Refresh Endpoint
router.post("/refresh",handleRefresh)

//Get Vendor Status
router.get("/vendorStatus",handleGetLatestVendorStatus)

//Add Product
router.post("/:userId/vendor/sell",uploadFiles().single("productPhoto"),handleAddVendorProduct)

//Your Products
router.get("/:userId/vendor/Your-Products",handleVendorYourProducts)

//Delete Products
router.delete("/:userId/vendor/Your-Products",handleDeleteProduct)


module.exports = {
    router,
}