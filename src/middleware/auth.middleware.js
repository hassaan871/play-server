import tokenServices from "../services/jwt.service.js";

const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).json({
            success: false,
            messsage: "Access denied. No token provided"
        });

        const decoded = tokenServices.verifyToken(token);
        req.user = { userId: decoded._id };
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