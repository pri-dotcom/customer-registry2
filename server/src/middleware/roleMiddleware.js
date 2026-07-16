// ==============================================
// Role Based Authorization Middleware
// ==============================================

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized. Please login first."
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You don't have permission to access this resource."
                });
            }

            next();

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });

        }
    };
};

module.exports = authorizeRoles;