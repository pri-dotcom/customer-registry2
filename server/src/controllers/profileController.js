const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");

// ==============================================
// Get Profile
// ==============================================
const getProfile = async (req, res) => {

    try {

        const customer = await Customer.findById(req.user._id)
            .select("-password");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: customer
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
            profileImage
        } = req.body;

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        customer.name = name || customer.name;
        customer.phone = phone || customer.phone;
        customer.address = address || customer.address;
        customer.profileImage =
            profileImage || customer.profileImage;

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            data: customer
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

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            customer.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        customer.password = await bcrypt.hash(newPassword, 10);

        await customer.save();

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

        const existingCustomer = await Customer.findOne({ email });

        if (
            existingCustomer &&
            existingCustomer._id.toString() !== req.user._id.toString()
        ) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        customer.email = email;

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Email updated successfully.",
            data: customer
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

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        await customer.deleteOne();

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

// ==============================================
// Export Controllers
// ==============================================

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    updateEmail,
    deleteAccount
};