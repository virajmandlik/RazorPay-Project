import app from "./app.js";
import dotenv from "dotenv";
import Razoroay from "razorpay";
dotenv.config({
    path: "./config/config.env"
});
const PORT = process.env.PORT;

export const instance = new Razoroay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
});





app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
} );