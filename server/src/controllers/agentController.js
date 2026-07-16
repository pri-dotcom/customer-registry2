const Agent = require("../models/Agent");
const Complaint = require("../models/Complaint");
const bcrypt = require("bcryptjs");

// ==============================================
// Add New Agent (Admin)
// ==============================================
const addAgent = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            department,
            designation
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided."
            });
        }

        const existingAgent = await Agent.findOne({ email });

        if (existingAgent) {
            return res.status(409).json({
                success: false,
                message: "Agent already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const agent = await Agent.create({

            name,

            email,

            password: hashedPassword,

            phone,

            department,

            designation,

            role: "agent"

        });

        return res.status(201).json({

            success: true,

            message: "Agent created successfully.",

            data: agent

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ==============================================
// Get All Agents
// ==============================================
const getAllAgents = async (req, res) => {

    try {

        const agents = await Agent.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: agents.length,

            data: agents

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// ==============================================
// Get Agent By ID
// ==============================================
const getAgentById = async (req, res) => {

    try {

        const agent = await Agent.findById(req.params.id)
            .select("-password");

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found."
            });
        }

        return res.status(200).json({

            success: true,

            data: agent

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};
// ==============================================
// Update Agent
// ==============================================
const updateAgent = async (req, res) => {

    try {

        const {
            name,
            phone,
            department,
            designation
        } = req.body;

        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found."
            });
        }

        agent.name = name || agent.name;
        agent.phone = phone || agent.phone;
        agent.department = department || agent.department;
        agent.designation = designation || agent.designation;

        await agent.save();

        return res.status(200).json({
            success: true,
            message: "Agent updated successfully.",
            data: agent
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ==============================================
// Activate / Deactivate Agent
// ==============================================
const toggleAgentStatus = async (req, res) => {

    try {

        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found."
            });
        }

        agent.isActive = !agent.isActive;

        await agent.save();

        return res.status(200).json({
            success: true,
            message: `Agent ${agent.isActive ? "activated" : "deactivated"} successfully.`,
            data: agent
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ==============================================
// Delete Agent
// ==============================================
const deleteAgent = async (req, res) => {

    try {

        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found."
            });
        }

        await agent.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Agent deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ==============================================
// Agent Workload
// ==============================================
const getAgentWorkload = async (req, res) => {

    try {

        const agentId = req.params.id;

        const totalAssigned = await Complaint.countDocuments({
            assignedAgent: agentId
        });

        const pending = await Complaint.countDocuments({
            assignedAgent: agentId,
            status: "Assigned"
        });

        const inProgress = await Complaint.countDocuments({
            assignedAgent: agentId,
            status: "In Progress"
        });

        const resolved = await Complaint.countDocuments({
            assignedAgent: agentId,
            status: "Resolved"
        });

        const closed = await Complaint.countDocuments({
            assignedAgent: agentId,
            status: "Closed"
        });

        return res.status(200).json({
            success: true,
            data: {
                totalAssigned,
                pending,
                inProgress,
                resolved,
                closed
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ==============================================
// Export Controllers
// ==============================================

module.exports = {
    addAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    toggleAgentStatus,
    deleteAgent,
    getAgentWorkload
};