const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Agent name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true
        },

        department: {
            type: String,
            required: true,
            default: "Customer Support"
        },

        designation: {
            type: String,
            default: "Support Agent"
        },

        profileImage: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["agent"],
            default: "agent"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Agent", agentSchema);