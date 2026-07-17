const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    getSystemStatistics,
    getRecentComplaints,
    deleteCustomer,
    dashboardCharts,
    getAllCustomers,
    getCustomFields,
    createCustomField,
    deleteCustomField,
    getCustomerById,
    updateCustomer
} = require("../controllers/adminController");

// ==============================================
// ADMIN PROFILE
// ==============================================

// Get Admin Profile
router.get(
    "/profile",
    authMiddleware,
    authorizeRoles("admin"),
    getAdminProfile
);

// Update Admin Profile
router.put(
    "/profile",
    authMiddleware,
    authorizeRoles("admin"),
    updateAdminProfile
);

// Change Password
router.patch(
    "/change-password",
    authMiddleware,
    authorizeRoles("admin"),
    changeAdminPassword
);

// ==============================================
// DASHBOARD
// ==============================================

// System Statistics
router.get(
    "/statistics",
    authMiddleware,
    authorizeRoles("admin"),
    getSystemStatistics
);

// Recent Complaints
router.get(
    "/recent-complaints",
    authMiddleware,
    authorizeRoles("admin"),
    getRecentComplaints
);

// Charts Data
router.get(
    "/charts",
    authMiddleware,
    authorizeRoles("admin"),
    dashboardCharts
);

// ==============================================
// CUSTOMER MANAGEMENT
// ==============================================

// Get All Customers
router.get(
    "/customers",
    authMiddleware,
    authorizeRoles("admin"),
    getAllCustomers
);

// Delete Customer
router.delete(
    "/customer/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteCustomer
);

// Get Customer Details (Admin and Agent)
router.get(
    "/customer/:id",
    authMiddleware,
    authorizeRoles("admin", "agent"),
    getCustomerById
);

// Update Customer Details (Admin and Agent)
router.put(
    "/customer/:id",
    authMiddleware,
    authorizeRoles("admin", "agent"),
    updateCustomer
);

// ==============================================
// CUSTOM FIELD CONFIGURATION
// ==============================================

// Get Custom Fields (Admins, Agents, and Customers)
router.get(
    "/custom-fields",
    authMiddleware,
    authorizeRoles("admin", "agent", "customer"),
    getCustomFields
);

// Create Custom Field (Admin)
router.post(
    "/custom-fields",
    authMiddleware,
    authorizeRoles("admin"),
    createCustomField
);

// Delete Custom Field (Admin)
router.delete(
    "/custom-fields/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteCustomField
);

module.exports = router;