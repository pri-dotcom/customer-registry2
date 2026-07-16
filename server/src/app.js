const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const agentRoutes = require("./routes/agentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

// Default Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Customer Care Registry API is running..."
    });
});
// Global Error Handler

const notFoundMiddleware = require("./middleware/notFoundMiddleware");


// 404 Handler
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);
module.exports = app;