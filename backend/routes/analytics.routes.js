const Router = require("express").Router;
const { getGroupWiseMonthlySpending, getSpendingPrediction } = require("../controllers/analytics.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

const router = Router();

// All analytics routes should be protected
router.use(verifyJWT);

// GET /api/v1/analytics/monthly-group-stats
router.route("/monthly-group-stats").get(getGroupWiseMonthlySpending);

// GET /api/v1/analytics/prediction
router.route("/prediction").get(getSpendingPrediction);

module.exports = router;
