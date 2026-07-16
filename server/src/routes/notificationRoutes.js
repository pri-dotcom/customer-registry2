const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../controllers/notificationController");

// ==============================================
// Notification Routes
// ==============================================

// Get Logged-in User Notifications
router.get(
    "/",
    authMiddleware,
    getMyNotifications
);

// Mark Notification as Read
router.patch(
    "/:id/read",
    authMiddleware,
    markAsRead
);

// Mark All Notifications as Read
router.patch(
    "/read-all",
    authMiddleware,
    markAllAsRead
);

// Delete Notification
router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);

module.exports = router;