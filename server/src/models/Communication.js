const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema(
    {
        complaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        senderRole: {
            type: String,
            enum: ["customer", "agent", "admin"],
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        receiverRole: {
            type: String,
            enum: ["customer", "agent", "admin"],
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        attachment: {
            type: String,
            default: ""
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

module.exports = mongoose.model(
    "Communication",
    communicationSchema
);