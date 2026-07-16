const Communication = require("../models/Communication");

// ==============================================
// Send Message
// ==============================================
const sendMessage = async (req, res) => {
    try {

        const { complaintId, receiver, message } = req.body;

        if (!complaintId || !receiver || !message) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID, receiver and message are required."
            });
        }

        const newMessage = await Communication.create({
            complaint: complaintId,
            sender: req.user.id,
            receiver,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: newMessage
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
// Get Chat History
// ==============================================
const getChatHistory = async (req, res) => {

    try {

        const messages = await Communication.find({
            complaint: req.params.complaintId
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
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

module.exports = {
    sendMessage,
    getChatHistory
};