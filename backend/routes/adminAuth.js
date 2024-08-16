const express = require("express")
const router = express.Router()
const { handleAdminLogin,handleGetVendors,handleUpdateVendorStatus } = require("../controller/adminAuth")

router.post("/admin-login",handleAdminLogin)

router.get("/getVendors",handleGetVendors)

router.put("/updateVendorStatus",handleUpdateVendorStatus)

module.exports = {
    router,
}