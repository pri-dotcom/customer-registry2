const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        complaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true
        },
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent"
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
