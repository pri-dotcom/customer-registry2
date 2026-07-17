const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getProfile,
    updateProfile,
    changePassword,
    updateEmail,
    deleteAccount
} = require("../controllers/profileController");

// ==============================================
// Profile Routes
// ==============================================

// Get Profile
router.get(
    "/",
    authMiddleware,
    authorizeRoles("customer", "agent", "admin"),
    getProfile
);

// Update Profile
router.put(
    "/",
    authMiddleware,
    authorizeRoles("customer", "agent", "admin"),
    updateProfile
);

// Change Password
router.patch(
    "/change-password",
    authMiddleware,
    authorizeRoles("customer", "agent", "admin"),
    changePassword
);

// Update Email
router.patch(
    "/update-email",
    authMiddleware,
    authorizeRoles("customer", "agent", "admin"),
    updateEmail
);

// Delete Account
router.delete(
    "/",
    authMiddleware,
    authorizeRoles("customer", "agent", "admin"),
    deleteAccount
);

module.exports = router;