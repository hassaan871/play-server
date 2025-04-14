import User from "../models/user.model.js";
import tokenServices from "../services/jwt.service.js";
import asyncHandler from "../util/asyncHandler.js";
import bcryptTasks from "../util/bcrypt.utility.js";
import { validateUserData } from "../validations/validations.js";

const { comparePassword, hashPassword } = bcryptTasks;
const { generateToken, verifyToken } = tokenServices;

const UserController = {
    SignUp: asyncHandler(async (req, res) => {
        const { username, email, fullName, password } = req.body;
        
        const { error } = validateUserData.body.validate({
            username, email, fullName, password
        });

        if (error) return res.status(400).json({
            success: false,
            message: "username, email, fullName, password all the four fields are required",
            error: error.details[0].message
        });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({
            success: false,
            message: "User Already exists"
        });

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            email,
            fullName,
            password: hashedPassword
        });

        const token = generateToken(newUser);

        const { password:_, ...restData } = newUser.toObject();
        return res.status(201).header("x-auth-token",token).json({
            success: true,
            message: "User registered successfully",
            payload: {
                user: restData,
                token
            }
        });
    }),

    Login: asyncHandler(async (req, res) => {
        const {email, password} = req.body;
        if(!email || !password) return res.status(400).json({
            success: false,
            message: "Both email and Password are required"
        });

        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });

        const isValid = await comparePassword(password, user.password);
        if(!isValid) return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });

        const token =  generateToken(user);
        const { password:_, ...userData} = user.toObject();

        return res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            user: userData,
            token
        });
    })
}

export default UserController;