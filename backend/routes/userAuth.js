const express = require("express")
const router = express.Router()
const { handleUserLogin,handleUserSignUP,handleRefresh } = require("../controller/userAuth.js")
const { handleGetLatestVendorStatus } = require("../controller/adminAuth.js")
const { handleAddVendorProduct,handleVendorYourProducts } = require("../controller/vendorAddProduct.js")
const { uploadFiles } = require("../multer/multer.js")


//home
router.get("/",(req,res)=>{
    res.json({message : "successfully connected"})
})


//Login
router.post("/login",handleUserLogin)


//SignUP
router.post("/signUP",handleUserSignUP)

    

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



module.exports = {
    router,
}