const Razorpay = require('razorpay');
const crypto = require('crypto');
const { paymentDetail } = require('../model/paymentDetails');
const { generateHash } = require('random-hash');
const { otherFriendId, passAllDetails } = require('./addToCart');
const { getIdToken } = require('../middleware/authToken');
const { newUser } = require("../model/userAuth")
const { io } = require("../socketConnect")
const { addressDetailsToDB } = require("../model/addressDetails")


let userProductPurchaseId = [];
let userId = '';
let storeHashed = '';
let selfHashed = '';
let initiaterUserId = '';
let storeAllProductIds = [];
let productTotalAmount = 0



async function handleUserPaymentCheckOut(req, res) {
    try {
        const { productPrice, productId, isHashed } = req.body;

        //Extract Address Details
        const { firstName, lastName, emailAddress, houseNo, streetNo, city, state, postalCode } = req.body.addressDetailsToDB

        const id = req.query.userId;
        const { storeFrontendHashed } = passAllDetails();
        const getOtherFriendId = otherFriendId();
        const getId = getIdToken();


        // Populate addressDetails object
        const addressDetails = {
            firstName,
            lastName,
            emailAddress,
            houseNo,
            streetNo,
            city,
            state,
            postalCode,
        };



          // Store the address details and other info in the session
          req.session.paymentInfo = {
            addressDetails, 
          };


        // Check if the provided hashed value matches the stored hash
        if (isHashed && isHashed !== storeFrontendHashed) {
            return res.json({
                message: 'not-found',
                otherFriendId: getOtherFriendId,
            });
        }

        storeHashed = isHashed;
        userId = id;
        initiaterUserId = getId;
        productTotalAmount = productPrice

        // Handle productId as an array or single object
        if (Array.isArray(productId)) {
            storeAllProductIds = productId.map(p => p.id);
            userProductPurchaseId = storeAllProductIds;
        } else {
            userProductPurchaseId = productId.id;
        }

        // Validate productPrice
        if (!productPrice || isNaN(productPrice) || productPrice <= 0) {
            return res.status(400).json({
                success: 'failed',
                message: 'Invalid product price',
            });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const order = await instance.orders.create({
            amount: productPrice * 100, // Convert to paise
            currency: 'INR',
            receipt: 'receipt#1',
        });

        // Generate a random hash
        selfHashed = generateHash({ length: 18 });

        return res.json(order);
    } catch (err) {
        console.error('Some error occurred', err);
        return res.status(500).json({
            success: 'failed',
            message: 'Server error',
        });
    }
}

async function handlePaymentVerification(req, res) {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generatedSignature = shasum.digest('hex');

        console.log("payment executed")


        if (generatedSignature === razorpay_signature) {
            await paymentDetail.create({
                userId: userId,
                userPaymentId: razorpay_payment_id,
                userOrderId: razorpay_order_id,
                userSignature: razorpay_signature,
                userProductPurchaseId: userProductPurchaseId,
                productTotalAmount: productTotalAmount,
                paymentMadeBy: initiaterUserId || "self"
            });
                
          // Retrieve stored session data
          const { addressDetails } = req.session.paymentInfo;
          const { firstName,lastName,emailAddress,houseNo,streetNo,city,state,postalCode } = addressDetails


          console.log(addressDetails,"payment")
            //Update Address Details too
            // Store address details in the database
            await addressDetailsToDB.create({
                firstName: firstName,
                lastName:lastName,
                email:emailAddress,
                houseNo:houseNo,
                streetNo:streetNo,
                city:city,
                state:state,
                 postalCode:postalCode,
                 userId: userId
         } );


            // Check if payment was made by someone else
            if (storeHashed) {

                const getDetailsFromDB = await newUser.find({ userId: initiaterUserId })

                io.emit("initiaterUserId", getDetailsFromDB)

                return res.redirect(`${process.env.REACT_API_URL}/${initiaterUserId}/paymentMadeByOther?hashed=${storeHashed}&initiaterUserId=${userId}`);
            }

            return res.redirect(`${process.env.REACT_API_URL}/${userId}/paymentSuccess?selfHashed=${selfHashed}`);
        } else {
            return res.status(400).json({ success: 'failed', message: 'Invalid signature' });
        }
    } catch (err) {
        console.error('Some error occurred at payment', err);
        return res.status(500).json({
            success: 'failed',
            message: 'Server error',
        });
    }
}

module.exports = {
    handleUserPaymentCheckOut,
    handlePaymentVerification,
};
