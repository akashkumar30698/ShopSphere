const express = require("express")
const router = express.Router()
const { handleStoreAllCarts,handleGetAllCarts ,handlePassValues, handleGetLatestPassValues,handleUpdateProducts } = require("../controller/addToCart")
const { getUserIdFromToken } = require("../middleware/authToken")
const { handleYourOrders } = require("../controller/yourOrders")

router.post("/:userId/cartPage",handleStoreAllCarts)

router.get("/:userId/cartPage",handleGetAllCarts)

router.post("/:userId/passValues",handlePassValues)

router.get("/:userId/getPassValues",getUserIdFromToken,handleGetLatestPassValues)


//Order Details
router.get("/:userId/yourOrders",handleYourOrders)

router.get("/updateProducts",handleUpdateProducts)

module.exports = {
    router,
}


