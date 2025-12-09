const Router = require("express").Router;
const { updateAccountDetails, deleteAccount, searchUsers } = require("../controllers/user.controller");
const { registerUser, loginUser, logoutUser } = require("../controllers/auth.controller"); // Create this if not exists or import from auth.controller
const { verifyJWT } = require("../middleware/auth.middleware");

const router = Router();

const passport = require("passport");
const { generateAccessAndRefereshTokens } = require("../services/auth.service"); // Needed for callback

// Public Routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

// Social Auth Routes
const { handleSocialCallback } = require("../controllers/social.controller");

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    handleSocialCallback
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/login" }),
    handleSocialCallback
);

// Protected Routes
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/delete-account").delete(verifyJWT, deleteAccount);
router.route("/search").get(verifyJWT, searchUsers);

module.exports = router;
