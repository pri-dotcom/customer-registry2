const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        recipientRole: {
            type: String,
            enum: ["customer", "agent", "admin"],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        complaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            default: null
        },

        type: {
            type: String,
            enum: [
                "Complaint",
                "Assignment",
                "Status Update",
                "Resolution",
                "General"
            ],
            default: "General"
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);