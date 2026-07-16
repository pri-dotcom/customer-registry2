const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    addAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    toggleAgentStatus,
    deleteAgent,
    getAgentWorkload
} = require("../controllers/agentController");

// ==============================================
// ADMIN ROUTES
// ==============================================

// Add New Agent
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    addAgent
);

// Get All Agents
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    getAllAgents
);

// Get Agent By ID
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    getAgentById
);

// Update Agent
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateAgent
);

// Activate / Deactivate Agent
router.patch(
    "/:id/status",
    authMiddleware,
    authorizeRoles("admin"),
    toggleAgentStatus
);

// Delete Agent
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteAgent
);

// Agent Workload
router.get(
    "/:id/workload",
    authMiddleware,
    authorizeRoles("admin"),
    getAgentWorkload
);

module.exports = router;