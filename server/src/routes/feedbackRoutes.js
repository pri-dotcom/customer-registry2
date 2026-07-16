const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    submitFeedback,
    getMyFeedback,
    getAllFeedback,
    deleteFeedback,
    feedbackAnalytics,
    getAgentFeedback
} = require("../controllers/feedbackController");

// ==============================================
// CUSTOMER ROUTES
// ==============================================

// Submit Feedback
router.post(
    "/",
    authMiddleware,
    authorizeRoles("customer"),
    submitFeedback
);

// Get My Feedback
router.get(
    "/my",
    authMiddleware,
    authorizeRoles("customer"),
    getMyFeedback
);

// ==============================================
// ADMIN ROUTES
// ==============================================

// Get All Feedback
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    getAllFeedback
);

// Feedback Analytics
router.get(
    "/analytics",
    authMiddleware,
    authorizeRoles("admin"),
    feedbackAnalytics
);

// Delete Feedback
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteFeedback
);

// Get Agent Feedback
router.get(
    "/agent",
    authMiddleware,
    authorizeRoles("agent"),
    getAgentFeedback
);

module.exports = router;