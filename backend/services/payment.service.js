const Razorpay = require("razorpay");
const crypto = require("crypto");
const { ApiError } = require("../utils/APIError");
const Expense = require("../models/expense.model");

class PaymentService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }

    async createOrder(amount, currency = "INR", receipt) {
        try {
            const options = {
                amount: Math.round(amount * 100), // Ensure integer paise
                currency,
                receipt,
            };
            const order = await this.razorpay.orders.create(options);
            return order;
        } catch (error) {
            throw new ApiError(500, "Failed to create Razorpay order in Service", [error.message]);
        }
    }

    verifyPaymentSignature({ orderId, paymentId, signature }) {
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + "|" + paymentId)
            .digest("hex");

        return generatedSignature === signature;
    }

    async settleUserDebt(userId, groupId) {
        // Find all expenses in this group where:
        // 1. User is NOT the payer
        // 2. User exists in splitDetails
        // 3. User is NOT in settledBy array

        const expenses = await Expense.find({
            group: groupId,
            payer: { $ne: userId },
            [`splitDetails.${userId}`]: { $exists: true }, // User owes money
            settledBy: { $ne: userId } // Not yet settled
        });

        if (expenses.length === 0) {
            return { message: "No pending expenses to settle" };
        }

        const updates = expenses.map(async (expense) => {
            expense.settledBy.push(userId);
            return expense.save();
        });

        await Promise.all(updates);
        return { message: `Settled ${expenses.length} expenses` };
    }
}

module.exports = new PaymentService();
