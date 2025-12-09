const paymentService = require("../services/payment.service");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/APIError");

const createOrder = async (req, res, next) => {
    try {
        const { amount, currency, receipt } = req.body;

        if (!amount) {
            throw new ApiError(400, "Amount is required");
        }

        const order = await paymentService.createOrder(amount, currency, receipt);

        return res.status(200).json(
            new ApiResponse(200, order, "Order created successfully")
        );
    } catch (error) {
        next(error);
    }
};

const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, groupId } = req.body;

        const isValid = paymentService.verifyPaymentSignature({
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature
        });

        if (!isValid) {
            throw new ApiError(400, "Invalid payment signature");
        }

        // Handle Group Settlement
        let settlementResult = {};
        if (groupId) {
            settlementResult = await paymentService.settleUserDebt(req.user._id, groupId);
        }

        return res.status(200).json(
            new ApiResponse(200, { verified: true, ...settlementResult }, "Payment verified successfully")
        );

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    verifyPayment
};
