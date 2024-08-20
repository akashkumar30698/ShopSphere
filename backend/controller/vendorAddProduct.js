const { productDetail } = require("../model/product")
const { uploadOnCloudinary } = require("../cloudinary/cloudinary")

async function handleAddVendorProduct(req,res){
    try{
        
       
        const {productTitle,productDescription,productPrice} = req.body
         const userId = req.query.userId
        
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
          return res.sendStatus(401).json({message:"No userId find"})
         }
         
         const filter = {$createdBy: userId}
         
        const products =  await productDetail.find(filter)

        return res.json({
          products: products
        })
    }
    catch(err){
      console.log("Some error occured",err)
    }
}

module.exports = {
    handleAddVendorProduct,
    handleVendorYourProducts,
}