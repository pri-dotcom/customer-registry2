const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
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

        role: {
            type: String,
            enum: ["customer"],
            default: "customer"
        },

        profileImage: {
            type: String,
            default: ""
        },

        address: {
            type: String,
            default: ""
        },

        customFields: {
            type: Map,
            of: String,
            default: {}
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

module.exports = mongoose.model("Customer", customerSchema);