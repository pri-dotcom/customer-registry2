const Communication = require("../models/Communication");
const Complaint = require("../models/Complaint");

// ==============================================
// Send Message
// ==============================================
const sendMessage = async (req, res) => {

    try {

        const {
            complaintId,
            receiver,
            receiverRole,
            message,
            attachment
        } = req.body;

        if (!complaintId || !receiver || !message) {
            return res.status(400).json({
                success: false,
                message: "Complaint, receiver and message are required."
            });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        const chat = await Communication.create({

            complaint: complaintId,

            sender: req.user._id,

            senderRole: req.user.role,

            receiver,

            receiverRole,

            message,

            attachment: attachment || ""

        });

        return res.status(201).json({

            success: true,

            message: "Message sent successfully.",

            data: chat

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
// Get Conversation by Complaint
// ==============================================
const getConversation = async (req, res) => {

    try {

        const complaintId = req.params.complaintId;

        const messages = await Communication.find({
            complaint: complaintId
        })
            .sort({ createdAt: 1 });

        return res.status(200).json({

            success: true,

            total: messages.length,

            data: messages

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
// Get My Chats
// ==============================================
const getMyChats = async (req, res) => {

    try {

        const chats = await Communication.find({

            $or: [

                { sender: req.user._id },

                { receiver: req.user._id }

            ]

        })
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: chats.length,

            data: chats

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
// Mark Messages as Read
// ==============================================
const markMessagesAsRead = async (req, res) => {

    try {

        const complaintId = req.params.complaintId;

        await Communication.updateMany(
            {
                complaint: complaintId,
                receiver: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Messages marked as read."
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
// Delete Conversation (Admin)
// ==============================================
const deleteConversation = async (req, res) => {

    try {

        const complaintId = req.params.complaintId;

        const result = await Communication.deleteMany({
            complaint: complaintId
        });

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully.",
            deletedMessages: result.deletedCount
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
// Chat Analytics
// ==============================================
const chatAnalytics = async (req, res) => {

    try {

        const totalMessages = await Communication.countDocuments();

        const unreadMessages = await Communication.countDocuments({
            isRead: false
        });

        const messagesByRole = await Communication.aggregate([
            {
                $group: {
                    _id: "$senderRole",
                    total: {
                        $sum: 1
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalMessages,
                unreadMessages,
                messagesByRole
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
    sendMessage,
    getConversation,
    getMyChats,
    markMessagesAsRead,
    deleteConversation,
    chatAnalytics
};