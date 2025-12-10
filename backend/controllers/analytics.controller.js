const Expense = require("../models/expense.model");
const Group = require("../models/group.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/APIError");
const ss = require("simple-statistics");
const mongoose = require("mongoose");

const getGroupWiseMonthlySpending = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Aggregate expenses: grouped by Group and Month
        const stats = await Expense.aggregate([
            {
                // 1. Filter expenses where the user is involved (in splitDetails)
                $match: {
                    [`splitDetails.${userId}`]: { $exists: true }
                }
            },
            {
                // 2. Project necessary fields including Month/Year from createdAt
                $project: {
                    group: 1,
                    amount: 1,
                    myShare: { $ifNull: [`$splitDetails.${userId}`, 0] },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
            },
            {
                // 3. Group by GroupId and (Year, Month)
                $group: {
                    _id: {
                        groupId: "$group",
                        year: "$year",
                        month: "$month"
                    },
                    totalGroupSpending: { $sum: "$amount" },
                    totalMySpending: { $sum: "$myShare" },
                    count: { $sum: 1 }
                }
            },
            {
                // 4. Sort by latest
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                // 5. Lookup Group details to show names
                $lookup: {
                    from: "groups",
                    localField: "_id.groupId",
                    foreignField: "_id",
                    as: "groupInfo"
                }
            },
            {
                $unwind: "$groupInfo"
            },
            {
                // 6. Final shape
                $project: {
                    groupName: "$groupInfo.name",
                    year: "$_id.year",
                    month: "$_id.month",
                    totalGroupSpending: 1,
                    totalMySpending: 1,
                    count: 1
                }
            }
        ]);

        return res.status(200).json(
            new ApiResponse(200, stats, "Group-wise monthly spending fetched successfully")
        );
    } catch (error) {
        next(error);
    }
};

const getSpendingPrediction = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // 1. Get historical spending per month (Time Series)
        const monthlyData = await Expense.aggregate([
            {
                $match: {
                    [`splitDetails.${userId}`]: { $exists: true }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalSpent: { $sum: { $ifNull: [`$splitDetails.${userId}`, 0] } }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        if (monthlyData.length < 2) {
            return res.status(200).json(
                new ApiResponse(200, {
                    history: monthlyData,
                    prediction: null,
                    message: "Not enough data for prediction (need at least 2 months)"
                }, "Insufficient data for prediction")
            );
        }

        // 2. Prepare data for Linear Regression
        // We need pairs of [x, y]. x = time index (0, 1, 2...), y = amount
        const dataPoints = monthlyData.map((item, index) => [index, item.totalSpent]);

        // 3. Train Model
        const regressionLine = ss.linearRegression(dataPoints);
        const regressionLineFunc = ss.linearRegressionLine(regressionLine);

        // 4. Predict Next Month
        const nextMonthIndex = monthlyData.length;
        const predictedAmount = regressionLineFunc(nextMonthIndex);

        // 5. Calculate R-squared (correlation coefficient) to see how good the fit is
        const rSquared = ss.rSquared(dataPoints, regressionLineFunc);

        // 6. Determine Trend
        const trend = regressionLine.m > 0 ? "Increasing" : "Decreasing";

        return res.status(200).json(
            new ApiResponse(200, {
                history: monthlyData,
                prediction: {
                    nextMonthIndex,
                    predictedAmount: Math.max(0, predictedAmount), // No negative spending
                    trend,
                    confidence: rSquared.toFixed(2), // 0 to 1
                    explanation: `Based on your spending trend (slope: ${regressionLine.m.toFixed(2)}), we predict next month's spending to be around ${Math.round(predictedAmount)}.`
                }
            }, "Spending prediction generated successfully")
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getGroupWiseMonthlySpending,
    getSpendingPrediction
};
