const Complaint = require("../models/Complaint");
const Agent = require("../models/Agent");

// ==============================================
// Create Complaint
// ==============================================
const createComplaint = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            priority
        } = req.body;

        // Validation
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description and category are required."
            });
        }

        // Create Complaint
        const complaint = await Complaint.create({

            customer: req.user._id,

            title,

            description,

            category,

            priority: priority || "Medium",

            status: "Pending"

        });

        return res.status(201).json({

            success: true,

            message: "Complaint created successfully.",

            data: complaint

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
// Get All Complaints (Admin)
// ==============================================
const getAllComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find()
            .populate("customer", "name email phone")
            .populate("assignedAgent", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: complaints.length,

            data: complaints

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
// Get Logged-in Customer Complaints
// ==============================================
const getMyComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find({

            customer: req.user._id

        })
            .populate("assignedAgent", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: complaints.length,

            data: complaints

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
// Get Complaint By ID
// ==============================================
const getComplaintById = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id)
            .populate("customer", "name email phone")
            .populate("assignedAgent", "name email department");

        if (!complaint) {

            return res.status(404).json({

                success: false,

                message: "Complaint not found."

            });

        }

        // Enforce strict role-based access checks
        if (req.user.role === "customer" && complaint.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this complaint."
            });
        }

        if (req.user.role === "agent" && (!complaint.assignedAgent || complaint.assignedAgent._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this complaint."
            });
        }

        return res.status(200).json({

            success: true,

            data: complaint

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
// Update Complaint
// ==============================================
const updateComplaint = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            priority
        } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });

        }

        if (complaint.customer.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this complaint."
            });

        }

        if (
            complaint.status === "Resolved" ||
            complaint.status === "Closed"
        ) {

            return res.status(400).json({
                success: false,
                message: "Resolved or Closed complaints cannot be updated."
            });

        }

        complaint.title = title || complaint.title;
        complaint.description = description || complaint.description;
        complaint.category = category || complaint.category;
        complaint.priority = priority || complaint.priority;

        await complaint.save();

        return res.status(200).json({

            success: true,

            message: "Complaint updated successfully.",

            data: complaint

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
// Delete Complaint
// ==============================================
const deleteComplaint = async (req, res) => {

    try {

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });

        }

        if (complaint.customer.toString() !== req.user._id.toString()) {

            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this complaint."
            });

        }

        if (
            complaint.status === "Resolved" ||
            complaint.status === "Closed"
        ) {

            return res.status(400).json({
                success: false,
                message: "Resolved or Closed complaints cannot be deleted."
            });

        }

        await complaint.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Complaint deleted successfully."

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
// Assign Complaint to Agent (Admin)
// ==============================================
const assignComplaint = async (req, res) => {

    try {

        const { agentId } = req.body;

        if (!agentId) {
            return res.status(400).json({
                success: false,
                message: "Agent ID is required."
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        const agent = await Agent.findById(agentId);

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found."
            });
        }

        complaint.assignedAgent = agent._id;
        complaint.status = "Assigned";

        await complaint.save();

        return res.status(200).json({
            success: true,
            message: "Complaint assigned successfully.",
            data: complaint
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
// Update Complaint Status (Agent)
// ==============================================
const updateComplaintStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        if (
            complaint.assignedAgent &&
            complaint.assignedAgent.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this complaint."
            });
        }

        complaint.status = status;

        await complaint.save();

        return res.status(200).json({
            success: true,
            message: "Complaint status updated successfully.",
            data: complaint
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
// Get Assigned Complaints (Agent)
// ==============================================
const getAssignedComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find({

            assignedAgent: req.user._id

        })
            .populate("customer", "name email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: complaints.length,

            data: complaints

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
// Complaint Statistics (Admin)
// ==============================================
const getComplaintStatistics = async (req, res) => {

    try {

        const total = await Complaint.countDocuments();

        const pending = await Complaint.countDocuments({
            status: "Pending"
        });

        const assigned = await Complaint.countDocuments({
            status: "Assigned"
        });

        const inProgress = await Complaint.countDocuments({
            status: "In Progress"
        });

        const resolved = await Complaint.countDocuments({
            status: "Resolved"
        });

        const closed = await Complaint.countDocuments({
            status: "Closed"
        });

        return res.status(200).json({

            success: true,

            data: {
                total,
                pending,
                assigned,
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

    createComplaint,

    getAllComplaints,

    getMyComplaints,

    getComplaintById,

    updateComplaint,

    deleteComplaint,

    assignComplaint,

    updateComplaintStatus,

    getAssignedComplaints,

    getComplaintStatistics

};