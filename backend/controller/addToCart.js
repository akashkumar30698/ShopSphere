const { addToCart } = require("../model/addToCart");
const PassUserIds = require("./userAuth")
const getIdToken = require("../middleware/authToken")
const { productDetail } = require("../model/product")
const cartData = [];

async function handleStoreAllCarts(req, res) {
   try {
      const cart = req.body;
      const userId = req.query.userId;

      if (!Array.isArray(cart)) {
         return res.status(400).send("Invalid cart format, expected an array of products.");
      }

      for (let i = 0; i < cart.length; i++) {
         const item = cart[i];

         if (!item.id || !item.title || !item.image || !item.price || !item.productQuantity) {
            return res.status(400).send(`Missing required fields in item at index ${i}`);
         }

         // Check if the product already exists in the cart for the user
         const existingCartItem = await addToCart.findOne({
            userId: userId,
            productId: item.id
         });

         if (existingCartItem) {
            // Update the quantity if the item already exists
            existingCartItem.productQuantity += item.productQuantity;
            await existingCartItem.save();
            cartData.push(existingCartItem);
         } else {
            // Create a new cart item if it doesn't exist
            const newCartItem = await addToCart.create({
               userId: userId,
               productId: item.id,
               productPhoto: item.image,
               productTitle: item.title,
               productPrice: item.price,
               productQuantity: item.productQuantity,
            });
            cartData.push(newCartItem);
         }
      }

      return res.status(200).json(cartData);
      
   } catch (err) {
      console.log("Some error occurred", err);
      res.status(500).send("Server error while storing cart items.");
   }
}

async function handleGetAllCarts(req,res){
   try{
      const allCarts =   await addToCart.find()

      return res.json(allCarts)
         
   }catch(err){
      console.log("Some error occured",err)
   }
}


let otherUserId = ""
let passTotalAmount = 0
let passAllProductId = []
let storeFrontendHashed = ""


function handlePassValues(req,res){
     const { userId,totalAmount,allProductId,storeHashed } = req.body
 
      otherUserId = userId
      passTotalAmount = totalAmount
      passAllProductId = allProductId
      storeFrontendHashed = storeHashed
         
      console.log(allProductId)
     return res.json("success")

}

let otherFriendUserId = ""


function handleGetLatestPassValues(req,res){
     
    const otherPersonUserId = req.query.otherUserId

    if(!otherPersonUserId){
         const checkLatestId = getIdToken()
         if(checkLatestId !== ""){
           otherPersonUserId = checkLatestId
         }
    }

    otherFriendUserId = otherPersonUserId

    otherUserId
    passTotalAmount 
    passAllProductId 

    console.log(passAllProductId)

    return res.json({
      otherUserId:otherUserId,
      passTotalAmount:passTotalAmount,
      passAllProductId:passAllProductId,
      id:passAllProductId[0].userId || ""
   })

}

async function handleUpdateProducts(req,res){
   try{

      const input = req.body

     const products = await   productDetail.find({category:input})

     if(products){
           return res.json(products)
     }else{
      return res.status(404).json("failure")
     }


   }catch(err){
      console.log("Some error occured",err)
   }
}

function passAllDetails(){
   return {
      otherUserId:otherUserId,
      passTotalAmount:passTotalAmount,
      passAllProductId:passAllProductId,
      storeFrontendHashed:storeFrontendHashed,
   }
}


function otherFriendId(){
   return otherFriendUserId
}


module.exports = {
   handleStoreAllCarts,
   handleGetAllCarts,
   handlePassValues,
   handleGetLatestPassValues,
   passAllDetails,
   otherFriendId,
   handleUpdateProducts
};
