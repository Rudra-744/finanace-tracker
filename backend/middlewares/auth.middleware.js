import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) return res.status(401).json({ message: "Not logged in! Token missing." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "access_secret");

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return res.status(401).json({ message: "User belonging to this token no longer exists." });

        req.user = currentUser;
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired access token!", error: error.message });
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "You do not have permission to perform this action." });
        }
        next();
    };
};
