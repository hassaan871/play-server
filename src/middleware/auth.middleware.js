import User from "../models/user.model.js";
import tokenServices from "../services/jwt.service.js";

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token") || req.cookies.token;
        if (!token) return res.status(401).json({
            success: false,
            messsage: "Access denied. No token provided"
        });

        const decoded = tokenServices.verifyToken(token);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({
            success: false,
            message: "Invalid token. User not found"
        });

        if (!user.isVerified) return res.status(403).json({
            success: false,
            message: "Email not verified. Please verify your email to access this resource."
        });

        if (user.isDeleted) return res.status(404).json({
            success: false,
            message: "The user Profile is Deleted. User not found."
        });

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Auth error, authentication Failed!!!",
            error
        });
    }
}

export default auth;