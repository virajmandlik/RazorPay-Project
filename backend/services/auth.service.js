const User = require("../models/user.model");
const { ApiError } = require("../utils/APIError");

class AuthService {
    async registerUser({ username, email, password }) {
        if ([username, email, password].some(field => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email,
            password
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        return createdUser;
    }

    async loginUser({ email, username, password }) {
        if (!username && !email) {
            throw new ApiError(400, "Username or email is required");
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            throw new ApiError(404, "User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await this.generateAccessAndRefereshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return { user: loggedInUser, accessToken, refreshToken };
    }

    async generateAccessAndRefereshTokens(userId) {
        try {
            const user = await User.findById(userId);
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        } catch (error) {
            throw new ApiError(500, "Something went wrong while generating referesh and access token");
        }
    }

    async refreshAccessToken(incomingRefreshToken) {
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            const user = await User.findById(decodedToken?._id);

            if (!user) {
                throw new ApiError(401, "Invalid refresh token");
            }

            if (incomingRefreshToken !== user?.refreshToken) {
                throw new ApiError(401, "Refresh token is expired or used");
            }

            const options = {
                httpOnly: true,
                secure: true
            };

            const { accessToken, refreshToken: newRefreshToken } = await this.generateAccessAndRefereshTokens(user._id);
            return { accessToken, refreshToken: newRefreshToken };

        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token");
        }
    }
}

module.exports = new AuthService();
