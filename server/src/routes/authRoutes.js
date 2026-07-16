const express = require("express");
const router = express.Router();

const {
    register,
    login,
    agentLogin
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// ==============================================
// Authentication Routes
// ==============================================

// Customer Registration
router.post("/register", register);

// Customer/Admin Login
router.post("/login", login);

// Agent Login
router.post("/agent-login", agentLogin);

// Get Logged-in User
router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;