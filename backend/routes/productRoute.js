import express  from 'express';
import { ProcessPayement,paymentVerification } from '../controllers/productController.js';
import { getKey } from '../controllers/productController.js';
const router = express.Router()

router.route("/payment/process").post(ProcessPayement);
router.route("/getkey").get(getKey);
router.route("/paymentverification").post(paymentVerification)
export default router;