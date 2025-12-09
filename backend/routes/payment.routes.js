const Router = require("express").Router;
const { createOrder, verifyPayment } = require("../controllers/payment.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

const router = Router();

router.use(verifyJWT);

router.route("/order").post(createOrder);
router.route("/verify").post(verifyPayment);

module.exports = router;
