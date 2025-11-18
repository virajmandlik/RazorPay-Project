import express  from 'express';
import { ProcessPayement } from '../controllers/productController.js';
import { getKey } from '../controllers/productController.js';
const router = express.Router()

router.route("/payment/process").post(ProcessPayement);
router.route("/getkey").get(getKey);
export default router;