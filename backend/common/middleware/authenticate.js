import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.status(401).json({
                msg: "No token provided. Access denied."
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                msg: "Token has expired"
            });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                msg: "Invalid token"
            });
        }
        res.status(500).json({
            msg: "Authentication error: " + err.message
        });
    }
};
