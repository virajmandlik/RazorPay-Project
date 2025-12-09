const Router = require("express").Router;
const { registerUser, loginUser, logoutUser } = require("../controllers/auth.controller");

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

module.exports = router;
