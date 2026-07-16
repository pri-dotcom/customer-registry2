const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    updateComplaintStatus,
    assignComplaint,
    getAssignedComplaints
} = require("../controllers/complaintController");

// ==============================================
// CUSTOMER ROUTES
// ==============================================

// Create Complaint
router.post(
    "/",
    authMiddleware,
    authorizeRoles("customer"),
    createComplaint
);

// View My Complaints
router.get(
    "/my",
    authMiddleware,
    authorizeRoles("customer"),
    getMyComplaints
);

// View Complaint Details
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("customer", "admin", "agent"),
    getComplaintById
);

// Update Complaint
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("customer"),
    updateComplaint
);

// Delete Complaint
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("customer"),
    deleteComplaint
);

// ==============================================
// ADMIN ROUTES
// ==============================================

// View All Complaints
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    getAllComplaints
);

// Assign Complaint
router.patch(
    "/:id/assign",
    authMiddleware,
    authorizeRoles("admin"),
    assignComplaint
);

// Update Status
router.patch(
    "/:id/status",
    authMiddleware,
    authorizeRoles("admin"),
    updateComplaintStatus
);

// ==============================================
// AGENT ROUTES
// ==============================================

// View Assigned Complaints
router.get(
    "/assigned/list",
    authMiddleware,
    authorizeRoles("agent"),
    getAssignedComplaints
);

// Resolve Complaint
router.patch(
    "/:id/resolve",
    authMiddleware,
    authorizeRoles("agent"),
    updateComplaintStatus
);

module.exports = router;