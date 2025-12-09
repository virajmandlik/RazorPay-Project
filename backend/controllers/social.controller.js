const { generateAccessAndRefereshTokens } = require("../services/auth.service");

const handleSocialCallback = async (req, res) => {
    try {
        const { user } = req;
        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

        const options = {
            httpOnly: false, // Allow frontend to read if needed, or secure httpOnly
            secure: process.env.NODE_ENV === "production"
        };

        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`);
    } catch (error) {
        console.error("Social callback error", error);
        res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=Server Error`);
    }
};

module.exports = { handleSocialCallback };
