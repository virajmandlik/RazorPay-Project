import {instance} from "../server.js";
import crypto from "crypto"
export const ProcessPayement = async(req, res) => {

    const options = {
        amount: Number(req.body.amount* 100),//converting the number into  cents
        currency: "INR"
    };
    console.log("Reached here");
    const order = await instance.orders.create(options);
    console.log('order is here: ',order);
    res.status(200).json({
        success: true,  
        order
    });
}

//to get the rtazor pay api key to use that in our fronntend
export const getKey = async(req, res) => { 
    res.status(200).json({
    key: process.env.RAZORPAY_API_KEY
    })

}

//creating the payment verification controller
export const paymentVerification = async(req, res) => {
    console.log("Payment Verification Body:", req.body);
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET).update(body.toString()).digest('hex');
    // console.log("Expected Signature:", expectedSignature);
    // console.log("Received Signature:", razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;
    if(isAuthentic){
        return res.redirect(`http://localhost:5173/paymentSuccess?refrence=${razorpay_payment_id}`);
    }else{
        res.status(404).json({
        success: false  
    });
    }
    

}

