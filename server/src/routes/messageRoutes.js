const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    sendMessage,
    getChatHistory
} = require("../controllers/messageController");

// ==============================================
// Message Routes
// ==============================================

// Send Message
router.post("/", authMiddleware, sendMessage);

// Get Chat History
router.get("/:complaintId", authMiddleware, getChatHistory);

module.exports = router;