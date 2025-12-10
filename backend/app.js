const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
const passport = require("./config/passport");
app.use(passport.initialize());

// Routes Placeholder (will be added later)
const getAuthRoutes = require('./routes/auth.routes');
const paymentRouter = require('./routes/payment.routes');
const groupRouter = require('./routes/group.routes');
const userRouter = require('./routes/user.routes');

app.use("/api/v1/users", userRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/groups", groupRouter);

const analyticsRouter = require('./routes/analytics.routes');
app.use("/api/v1/analytics", analyticsRouter);

// Root route for testing
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Payment Splitter API" });
});

// Error Handler (Must be last)
app.use(errorHandler);

module.exports = { app };
