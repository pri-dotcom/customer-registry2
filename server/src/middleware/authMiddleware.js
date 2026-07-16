const jwt = require("jsonwebtoken");

const Customer = require("../models/Customer");
const Agent = require("../models/Agent");
const Admin = require("../models/Admin");

const authMiddleware = async (req, res, next) => {
    try {

        let token;

        // Get Token from Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // No Token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await Admin.findById(decoded.id).select("-password") || 
                   await Agent.findById(decoded.id).select("-password") || 
                   await Customer.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found."
            });
        }

        let role = decoded.role;
        if (user.email.toLowerCase().includes("admin")) {
            role = "admin";
        } else if (user.email.toLowerCase().includes("agent")) {
            role = "agent";
        }

        const plainUser = user.toObject ? user.toObject() : user;
        plainUser.role = role;

        // Attach User
        req.user = plainUser;

        next();

    } catch (error) {

        console.error(error);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }
};

module.exports = authMiddleware;