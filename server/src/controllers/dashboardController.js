const Complaint = require("../models/Complaint");
const Customer = require("../models/Customer");
const Agent = require("../models/Agent");

// ==============================================
// Customer Dashboard
// ==============================================
const customerDashboard = async (req, res) => {

    try {

        const customerId = req.user._id;

        const totalComplaints = await Complaint.countDocuments({
            customer: customerId
        });

        const pendingComplaints = await Complaint.countDocuments({
            customer: customerId,
            status: "Pending"
        });

        const assignedComplaints = await Complaint.countDocuments({
            customer: customerId,
            status: "Assigned"
        });

        const inProgressComplaints = await Complaint.countDocuments({
            customer: customerId,
            status: "In Progress"
        });

        const resolvedComplaints = await Complaint.countDocuments({
            customer: customerId,
            status: "Resolved"
        });

        const closedComplaints = await Complaint.countDocuments({
            customer: customerId,
            status: "Closed"
        });

        const recentComplaints = await Complaint.find({
            customer: customerId
        })
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            data: {
                totalComplaints,
                pendingComplaints,
                assignedComplaints,
                inProgressComplaints,
                resolvedComplaints,
                closedComplaints,
                recentComplaints
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
// Agent Dashboard
// ==============================================
const agentDashboard = async (req, res) => {

    try {

        const agentId = req.user._id;

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

        const recentComplaints = await Complaint.find({
            assignedAgent: agentId
        })
            .populate("customer", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            data: {
                totalAssigned,
                pending,
                inProgress,
                resolved,
                recentComplaints
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
// Admin Dashboard
// ==============================================
const adminDashboard = async (req, res) => {

    try {

        const totalCustomers = await Customer.countDocuments();

        const totalAgents = await Agent.countDocuments();

        const totalComplaints = await Complaint.countDocuments();

        const pendingComplaints = await Complaint.countDocuments({
            status: "Pending"
        });

        const assignedComplaints = await Complaint.countDocuments({
            status: "Assigned"
        });

        const inProgressComplaints = await Complaint.countDocuments({
            status: "In Progress"
        });

        const resolvedComplaints = await Complaint.countDocuments({
            status: "Resolved"
        });

        const closedComplaints = await Complaint.countDocuments({
            status: "Closed"
        });

        const recentComplaints = await Complaint.find()
            .populate("customer", "name email")
            .populate("assignedAgent", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            data: {

                totalCustomers,
                totalAgents,

                totalComplaints,

                pendingComplaints,
                assignedComplaints,
                inProgressComplaints,
                resolvedComplaints,
                closedComplaints,

                recentComplaints

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
// Dashboard Analytics
// ==============================================
const dashboardAnalytics = async (req, res) => {

    try {

        const complaintStatus = await Complaint.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: {
                        $sum: 1
                    }
                }
            }
        ]);

        const complaintPriority = await Complaint.aggregate([
            {
                $group: {
                    _id: "$priority",
                    total: {
                        $sum: 1
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                complaintStatus,
                complaintPriority
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
    customerDashboard,
    agentDashboard,
    adminDashboard,
    dashboardAnalytics
};