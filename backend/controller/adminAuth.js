const { newUser } = require("../model/userAuth")
const { generateAccessToken } = require("./userAuth")
const jwt = require("jsonwebtoken")
const { io } = require("../socketConnect")
const mongoose = require('mongoose');
const { VendorInitialStatus } = require("./userAuth")
require("dotenv").config()



let updatedVendorStatus = ""




async function handleAdminLogin(req, res) {
  try {
    const { secretCode, email, password } = req.body
    const protectedSecretCode = `${process.env.ADMIN_SECRET_CODE}`
    const protectedEmail = `${process.env.ADMIN_EMAIL}`
    const protectedPassword = `${process.env.ADMIN_PASSWORD}`

    if (secretCode == protectedSecretCode && email == protectedEmail && password == protectedPassword) {
      //Token Validations
      const accessToken = generateAccessToken({ secretCode: secretCode, email: email, password: password });
      const refreshToken = jwt.sign({ secretCode: secretCode, email: email, password: password }, `${process.env.REFRESH_SECRET_TOKEN}`);


      /*
   const options = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE,
    sameSite: 'None',
    maxAge: 10 * 60 * 1000,  
   };

    */


      res.cookie("accessToken", accessToken)


      return res.json({
        message: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      })

    }

    else {
      return res.json("failure")
    }


  }
  catch (err) {
    console.log("Oops some error occured at adminAuth.js", err)
  }
}




async function handleGetVendors(req, res) {
  try {
    const getVendors = await newUser.find({ role: "VENDOR" })

    if (!getVendors || getVendors == undefined || getVendors.length == 0) {
      return res.json({
        message: "failure"
      })
    }



    return res.json({
      getVendors
    })
  }
  catch (err) {
    console.log("Some error occured", err)
  }
}



async function handleUpdateVendorStatus(req, res) {


  try {

    const { id } = req.query;
    const { status } = req.body;


    const updatedVendor = await newUser.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }


    updatedVendorStatus = updatedVendor.status

    //sending approval status to vendor(frontend)
    io.emit("approvalStatus", updatedVendor)

    return res.json({ message: "Vendor status updated", updatedVendor });
  } catch (error) {
    console.error("Error updating vendor status:", error);
    res.status(500).json({ message: "Server error" });
  }


}

async function handleGetLatestVendorStatus(req, res) {
  try {
    const userId = req.query.userId;

    // Ensure the userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Replace this with actual logic or function to fetch the vendor's initial status
    let initialVendorStatus = await VendorInitialStatus(); // Ensure this function exists and is working

    console.log('Initial Vendor Status:', initialVendorStatus);

    let updatedVendorStatus = null;

    // Check if initialVendorStatus is empty or null
    if (!initialVendorStatus) {

      // Convert userId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);

      console.log(userObjectId)

      // Fetch the vendor's latest status from the database
      const refreshedStatus = await newUser.findOne({ _id: userObjectId });

      // Handle case where user is not found
      if (!refreshedStatus) {
        return res.status(404).json({ error: "User not found" });
      }

      // Extract the refreshed status (assuming `status` is the correct field)
      updatedVendorStatus = refreshedStatus.status || null;
      console.log(refreshedStatus, "if executed", userId);

      return res.json({
        initialVendorStatus: updatedVendorStatus, // Send the updated status
        updatedVendorStatus: "", // No update yet, so this is empty
      });
    }

    console.log(initialVendorStatus, "no ifs");

    // If `initialVendorStatus` exists, return it and an empty updated status
    return res.json({
      initialVendorStatus: initialVendorStatus,
      updatedVendorStatus: "", // No update in this case
    });

  } catch (err) {
    console.log("Some error occurred", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  handleAdminLogin,
  handleGetVendors,
  handleUpdateVendorStatus,
  handleGetLatestVendorStatus,
}