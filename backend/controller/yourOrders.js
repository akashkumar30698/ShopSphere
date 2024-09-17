const { addressDetailsToDB } = require("../model/addressDetails");
const { paymentDetail } = require("../model/paymentDetails")

async function handleYourOrders(req, res) {
  try {
    const { userId } = req.query;

    // Fetch orders from the database based on the userId
    const orders = await paymentDetail.find({ userId });

    // If orders exist, send them back as a response
    if (orders.length > 0) {
      return  res.status(200).json(orders);
    } else {

     return  res.status(404).json({ message: "No orders found for this user." });
    }


  } catch (err) {
    console.error("Some error occurred", err);
   return  res.status(500).json({ message: "Server error, please try again later." });
  }
}

module.exports = {
  handleYourOrders,
};
