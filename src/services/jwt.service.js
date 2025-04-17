import jwt from "jsonwebtoken";

const tokenServices = {
    generateToken: (user) => {
        return jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
};

export default tokenServices;
