const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const Agent = require("../models/Agent");
const Complaint = require("../models/Complaint");

const bcrypt = require("bcryptjs");

// ==============================================
// Get Admin Profile
// ==============================================
const getAdminProfile = async (req, res) => {

    try {

        const admin = await Admin.findById(req.user._id)
            .select("-password");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: admin
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
// Update Admin Profile
// ==============================================
const updateAdminProfile = async (req, res) => {

    try {

        const {
            name,
            phone
        } = req.body;

        const admin = await Admin.findById(req.user._id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        admin.name = name || admin.name;
        admin.phone = phone || admin.phone;

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Admin profile updated successfully.",
            data: admin
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
// Change Admin Password
// ==============================================
const changeAdminPassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new password are required."
            });
        }

        const admin = await Admin.findById(req.user._id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }
                const isMatch = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        admin.password = await bcrypt.hash(newPassword, 10);

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
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
// Get System Statistics
// ==============================================
const getSystemStatistics = async (req, res) => {

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

                closedComplaints

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
// Get Recent Complaints
// ==============================================
const getRecentComplaints = async (req, res) => {

    try {

        const complaints = await Complaint.find()
            .populate("customer", "name email")
            .populate("assignedAgent", "name email")
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
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
// Delete Customer
// ==============================================
const deleteCustomer = async (req, res) => {

    try {

        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        await customer.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Customer deleted successfully."
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
// Dashboard Charts
// ==============================================
const dashboardCharts = async (req, res) => {

    try {

        const statusChart = await Complaint.aggregate([
            {
                $group: {
                    _id: "$status",
                    total: {
                        $sum: 1
                    }
                }
            }
        ]);

        const priorityChart = await Complaint.aggregate([
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
                statusChart,
                priorityChart
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
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().select("-password").sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            total: customers.length,
            data: customers
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
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    getSystemStatistics,
    getRecentComplaints,
    deleteCustomer,
    dashboardCharts,
    getAllCustomers
};