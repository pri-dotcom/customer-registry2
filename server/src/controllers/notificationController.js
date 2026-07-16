const Notification = require("../models/Notification");

// ==============================================
// Get My Notifications
// ==============================================
const getMyNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({
            recipient: req.user._id
        })
            .populate("complaint", "title status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: notifications.length,
            data: notifications
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
// Mark Notification as Read
// ==============================================
const markAsRead = async (req, res) => {

    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        if (
            notification.recipient.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: notification
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
// Mark All Notifications as Read
// ==============================================
const markAllAsRead = async (req, res) => {

    try {

        await Notification.updateMany(
            {
                recipient: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read."
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
// Delete Notification
// ==============================================
const deleteNotification = async (req, res) => {

    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        if (
            notification.recipient.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        await notification.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully."
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
// Send Notification (Internal Helper)
// ==============================================
const sendNotification = async ({
    recipient,
    recipientRole,
    title,
    message,
    complaint = null,
    type = "General"
}) => {

    try {

        const notification = await Notification.create({
            recipient,
            recipientRole,
            title,
            message,
            complaint,
            type
        });

        return notification;

    } catch (error) {

        console.error("Notification Error:", error);

        return null;

    }

};

// ==============================================
// Export Controllers
// ==============================================
module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification
};