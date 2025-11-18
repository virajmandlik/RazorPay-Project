import {instance} from "../server.js";

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
