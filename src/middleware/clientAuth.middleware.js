import User from "../models/user.model.js";
import tokenServices from "../services/jwt.service.js";

const clientAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            console.log("No token found in cookies. Redirecting to login... ");
            return res.redirect("/view/login");
        }
        let decoded
        try {
            decoded = tokenServices.verifyToken(token);
        } catch (err) {
            console.log("Token verification failed: ", err.message);
            return res.redirect("/view/login");
        }
        const user = await User.findById(decoded.id).select("-password");
        if(!user || user.isDeleted) {
            console.log("User not found or account deleted. Redirecting to login... ");
            return res.redirect("/view/login");
        }
        if(!user.isVerified) {
            console.log("User email not verified. Redirecting to verificaiton page... ");
            return res.redirect("/view/verify-email");
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in clientAuth middleware: ", error.message);
        return res.redirect('/view/login');
    }
};

export default clientAuth;