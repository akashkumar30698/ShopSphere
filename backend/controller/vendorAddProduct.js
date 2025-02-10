const { productDetail } = require("../model/product")
const { uploadOnCloudinary } = require("../cloudinary/cloudinary")
const cors = require("cors")


async function handleAddVendorProduct(req,res){
    try{

        const {productTitle,productDescription,productPrice,category} = req.body
         const userId = req.query.userId

         console.log(req.body)
        
        if (!req.file) {
         
            return res.status(400).json({ message: "No file uploaded" });
          }

      
          const localFilePath = req.file.path;
        
          const cloudURL = await uploadOnCloudinary(localFilePath);
          if (!cloudURL || !cloudURL.url) {
            throw new Error("Failed to upload image to Cloudinary");
          }
      
          const vendorImageURL = cloudURL.url.replace(/^http:\/\//i, "https://");

         const vendorProduct =   await productDetail.create({
            productPhoto: vendorImageURL,
            productTitle: productTitle,
            productDescription: productDescription,
            productPrice: "₹" + productPrice,
            category: category,
            createdBy: userId
        })


      return res.json(vendorProduct) 


    }
    catch(err){
        console.log("Some error occured adding product to database",err)
    }
}



async function handleVendorYourProducts(req,res){
    try{
         const userId = req.query.userId
         if(!userId){
          return res.status(401).json({message:"No userId find"})
         }

        const products =  await productDetail.find({createdBy:userId})
        return res.json({
          products: products
        })
    }
    catch(err){
      console.log("Some error occured",err)
    }
}


async function handleDeleteProduct(req,res){
  try{
      const productId = req.query.productId
     const deleteQuery = await productDetail.findByIdAndDelete(productId)
     
    if(!deleteQuery){
        return res.status(401).json("unable to find product Id")
    }



    return res.json("success")

  }catch(err){
    console.log("Error deleting Product",err)
  }
}


async function handleGetAllProducts(req, res) {
  // Enable CORS for this route
    try {
      const allProducts = await productDetail.find()

      return res.json({
        allProduct: allProducts,
      })
    } catch (err) {
      console.log("Some error occurred", err)
      return res.status(500).json({ error: "Internal server error" })
    }
  
}

module.exports = {
    handleAddVendorProduct,
    handleVendorYourProducts,
    handleDeleteProduct,
    handleGetAllProducts,
}