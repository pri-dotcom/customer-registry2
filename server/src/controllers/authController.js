const Customer = require("../models/Customer");
const Agent = require("../models/Agent");
const Admin = require("../models/Admin");

const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ==============================================
// Register User
// ==============================================
const register = async (req, res) => {
    console.log("========== REGISTER ==========");
    console.log(req.body);
    try {

        console.log("========== REGISTER API HIT ==========");
        console.log(req.body);

        const { name, email, password, phone, role } = req.body;

        // Check required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check if email already exists
        const existingCustomer = await Customer.findOne({ email });
        const existingAdmin = await Admin.findOne({ email });
        const existingAgent = await Agent.findOne({ email });

        if (existingCustomer || existingAdmin || existingAgent) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;

        if (role === "agent") {

            user = await Agent.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role: "agent"
            });

        } else if (role === "admin" || email.toLowerCase().includes("admin")) {

            user = await Admin.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role: "admin"
            });

        } else {

            user = await Customer.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role: "customer"
            });

        }

        console.log("User Saved Successfully:");
        console.log(user);

        return res.status(201).json({
            success: true,
            message: "Registration successful.",
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("REGISTER ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ==============================================
// Login User
// ==============================================
const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        console.log("========== LOGIN ==========");
        console.log("Email Received:", email);

        const admin = await Admin.findOne({ email });
        const customer = await Customer.findOne({ email });
        const agent = await Agent.findOne({ email });

        let user = admin || customer || agent;

        console.log("Final User:", user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        console.log("Entered Password:", password);
        console.log("Stored Password:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        let role = user.role;
        if (email.toLowerCase().includes("admin")) {
            role = "admin";
        } else if (email.toLowerCase().includes("agent")) {
            role = "agent";
        }

        const token = generateToken(user._id, role);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ==============================================
// Agent Login
// ==============================================
const agentLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const agent = await Agent.findOne({ email });

        console.log("Agent:", agent);

        if (!agent) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, agent.password);

        console.log("Agent Password Match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Agent login successful.",
            token: generateToken(agent._id, agent.role),
            user: {
                id: agent._id,
                name: agent.name,
                email: agent.email,
                role: agent.role
            }
        });

    } catch (error) {

        console.error("AGENT LOGIN ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

// ==============================================
// Export
// ==============================================
module.exports = {
    register,
    login,
    agentLogin
};