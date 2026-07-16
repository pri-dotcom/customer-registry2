const validateRegister = (req, res, next) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    next();
};

const validateComplaint = (req, res, next) => {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
        return res.status(400).json({
            success: false,
            message: "Title, description and category are required."
        });
    }

    next();
};

const validateFeedback = (req, res, next) => {
    const { complaintId, rating } = req.body;

    if (!complaintId || !rating) {
        return res.status(400).json({
            success: false,
            message: "Complaint ID and rating are required."
        });
    }

    next();
};

module.exports = {
    validateRegister,
    validateComplaint,
    validateFeedback
};