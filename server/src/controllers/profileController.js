const Customer = require("../models/Customer");
const Agent = require("../models/Agent");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const getModel = (role) => {
    if (role === "admin") return Admin;
    if (role === "agent") return Agent;
    return Customer;
};

// ==============================================
// Get Profile
// ==============================================
const getProfile = async (req, res) => {
    try {
        const Model = getModel(req.user.role);
        const user = await Model.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: user
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
// Update Profile
// ==============================================
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            address,
            profileImage,
            department,
            designation,
            customFields
        } = req.body;

        const Model = getModel(req.user.role);
        const user = await Model.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.profileImage = profileImage || user.profileImage;

        if (req.user.role === "agent") {
            user.department = department || user.department;
            user.designation = designation || user.designation;
        }

        if (req.user.role === "customer") {
            user.address = address || user.address;
            if (customFields) {
                user.customFields = customFields;
            }
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: user
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
// Change Password
// ==============================================
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new password are required."
            });
        }

        const Model = getModel(req.user.role);
        const user = await Model.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

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
// Update Email
// ==============================================
const updateEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        const existingAdmin = await Admin.findOne({ email });
        const existingAgent = await Agent.findOne({ email });
        const existingCustomer = await Customer.findOne({ email });

        const existingUser = existingAdmin || existingAgent || existingCustomer;

        if (
            existingUser &&
            existingUser._id.toString() !== req.user._id.toString()
        ) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const Model = getModel(req.user.role);
        const user = await Model.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        user.email = email;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email updated successfully.",
            data: user
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
// Delete Account
// ==============================================
const deleteAccount = async (req, res) => {
    try {
        const Model = getModel(req.user.role);
        const user = await Model.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        await user.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    updateEmail,
    deleteAccount
};