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
    authorizeRoles("customer"),
    getProfile
);

// Update Profile
router.put(
    "/",
    authMiddleware,
    authorizeRoles("customer"),
    updateProfile
);

// Change Password
router.patch(
    "/change-password",
    authMiddleware,
    authorizeRoles("customer"),
    changePassword
);

// Update Email
router.patch(
    "/update-email",
    authMiddleware,
    authorizeRoles("customer"),
    updateEmail
);

// Delete Account
router.delete(
    "/",
    authMiddleware,
    authorizeRoles("customer"),
    deleteAccount
);

module.exports = router;