import User from "../models/user.model.js";
import tokenServices from "../services/jwt.service.js";

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).json({
            success: false,
            messsage: "Access denied. No token provided"
        });

        const decoded = tokenServices.verifyToken(token);
        
        const user = await User.findById(decoded.id).select("-password");
        if(!user) return res.status(401).json({
            success: false,
            message: "Invalid token. User not found" 
        });

        if(!user.isVerified) return res.status(403).json({
            success: false,
            message: "Email not verified. Please verify your email to access this resource."
        });

        req.user = { user };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            messsage: "Auth error, authentication Failed!!!",
            error
        });
    }
}

export default auth;