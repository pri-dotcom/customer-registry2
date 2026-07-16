const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");
const Agent = require("../models/Agent");

// ==============================================
// Submit Feedback
// ==============================================
const submitFeedback = async (req, res) => {

    try {

        const {
            complaintId,
            agentId,
            rating,
            comment
        } = req.body;

        if (!complaintId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Complaint and rating are required."
            });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        if (complaint.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        const existingFeedback = await Feedback.findOne({
            complaint: complaintId
        });

        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message: "Feedback already submitted."
            });
        }

        const feedback = await Feedback.create({

            customer: req.user._id,

            complaint: complaintId,

            agent: agentId,

            rating,

            comment

        });

        return res.status(201).json({

            success: true,

            message: "Feedback submitted successfully.",

            data: feedback

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
// Get Logged-in User Feedback
// ==============================================
const getMyFeedback = async (req, res) => {

    try {

        const feedback = await Feedback.find({

            customer: req.user._id

        })
            .populate("complaint", "title")
            .populate("agent", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: feedback.length,

            data: feedback

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
// Get All Feedback (Admin)
// ==============================================
const getAllFeedback = async (req, res) => {

    try {

        const feedback = await Feedback.find()
            .populate("customer", "name email")
            .populate("agent", "name email")
            .populate("complaint", "title status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: feedback.length,
            data: feedback
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
// Delete Feedback (Admin)
// ==============================================
const deleteFeedback = async (req, res) => {

    try {

        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found."
            });
        }

        await feedback.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Feedback deleted successfully."
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
// Feedback Analytics (Admin)
// ==============================================
const feedbackAnalytics = async (req, res) => {

    try {

        const totalFeedback = await Feedback.countDocuments();

        const averageRating = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    }
                }
            }
        ]);

        const ratingDistribution = await Feedback.aggregate([
            {
                $group: {
                    _id: "$rating",
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalFeedback,
                averageRating:
                    averageRating.length > 0
                        ? averageRating[0].averageRating.toFixed(2)
                        : 0,
                ratingDistribution
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

const getAgentFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ agent: req.user._id })
            .populate("customer", "name email")
            .populate("complaint", "title status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: feedback.length,
            data: feedback
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
    submitFeedback,
    getMyFeedback,
    getAllFeedback,
    deleteFeedback,
    feedbackAnalytics,
    getAgentFeedback
};