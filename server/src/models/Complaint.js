const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            default: null
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Assigned",
                "In Progress",
                "Resolved",
                "Closed"
            ],
            default: "Pending"
        },

        resolution: {
            type: String,
            default: ""
        },

        resolvedAt: {
            type: Date,
            default: null
        },

        attachments: [
            {
                fileName: String,
                fileUrl: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);