const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    customerDashboard,
    agentDashboard,
    adminDashboard,
    dashboardAnalytics
} = require("../controllers/dashboardController");

// ==============================================
// Customer Dashboard
// ==============================================
router.get(
    "/customer",
    authMiddleware,
    authorizeRoles("customer"),
    customerDashboard
);

// ==============================================
// Agent Dashboard
// ==============================================
router.get(
    "/agent",
    authMiddleware,
    authorizeRoles("agent"),
    agentDashboard
);

// ==============================================
// Admin Dashboard
// ==============================================
router.get(
    "/admin",
    authMiddleware,
    authorizeRoles("admin"),
    adminDashboard
);

// ==============================================
// Dashboard Analytics (Admin)
// ==============================================
router.get(
    "/analytics",
    authMiddleware,
    authorizeRoles("admin"),
    dashboardAnalytics
);

module.exports = router;