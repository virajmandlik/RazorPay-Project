const User = require("../models/user.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/APIError");

const updateAccountDetails = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        if (!username && !email) {
            throw new ApiError(400, "At least one field (username or email) is required");
        }

        const user = await User.findById(req.user._id);
        if (!user) throw new ApiError(404, "User not found");

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        return res.status(200).json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
    } catch (error) {
        next(error);
    }
};

const deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) throw new ApiError(404, "User not found");

        // Ideally we should also remove them from groups or mark as deleted, 
        // but for now simple deletion as per request.

        return res
            .status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json(new ApiResponse(200, {}, "Account deleted successfully"));
    } catch (error) {
        next(error);
    }
};

const searchUsers = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(200).json(new ApiResponse(200, [], "No query provided"));
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("username email _id");

        return res.status(200).json(
            new ApiResponse(200, users, "Users fetched successfully")
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateAccountDetails,
    deleteAccount,
    searchUsers
};
