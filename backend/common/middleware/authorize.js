import User from "../models/User.js";

export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.userId);
            
            if (!user) {
                return res.status(404).json({
                    msg: "User not found"
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    msg: `Access denied. Required role(s): ${allowedRoles.join(", ")}`
                });
            }

            req.userRole = user.role;
            next();
        } catch (err) {
            res.status(500).json({
                msg: "Authorization error: " + err.message
            });
        }
    };
};
