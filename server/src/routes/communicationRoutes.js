const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    sendMessage,
    getConversation,
    getMyChats,
    markMessagesAsRead,
    deleteConversation,
    chatAnalytics
} = require("../controllers/communicationController");

// ==============================================
// Customer / Agent Routes
// ==============================================

// Send Message
router.post(
    "/",
    authMiddleware,
    authorizeRoles("customer", "agent"),
    sendMessage
);

// Get My Chats
router.get(
    "/",
    authMiddleware,
    authorizeRoles("customer", "agent"),
    getMyChats
);

// Get Conversation by Complaint
router.get(
    "/:complaintId",
    authMiddleware,
    authorizeRoles("customer", "agent", "admin"),
    getConversation
);

// Mark Messages as Read
router.patch(
    "/:complaintId/read",
    authMiddleware,
    authorizeRoles("customer", "agent"),
    markMessagesAsRead
);

// ==============================================
// Admin Routes
// ==============================================

// Delete Conversation
router.delete(
    "/:complaintId",
    authMiddleware,
    authorizeRoles("admin"),
    deleteConversation
);

// Chat Analytics
router.get(
    "/analytics/summary",
    authMiddleware,
    authorizeRoles("admin"),
    chatAnalytics
);

module.exports = router;