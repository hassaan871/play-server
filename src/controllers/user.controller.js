import crypto from "crypto";
import User from "../models/user.model.js";
import tokenServices from "../services/jwt.service.js";
import asyncHandler from "../util/asyncHandler.js";
import bcryptTasks from "../util/bcrypt.utility.js";
import { validateUserData } from "../validations/validations.js";
import sendEmail from "../services/sendEmail.service.js";

const { comparePassword, hashPassword } = bcryptTasks;
const { generateToken, verifyToken } = tokenServices;

const UserController = {
    SignUp: asyncHandler(async (req, res) => {
        const { username, email, fullName, password } = req.body;

        const { error } = validateUserData.Signup.validate({
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

        const { password: _, ...restData } = newUser.toObject();
        return res.status(201).header("x-auth-token", token).json({
            success: true,
            message: "User registered successfully",
            payload: {
                user: restData,
                token
            }
        });
    }),

    Login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({
            success: false,
            message: "Both email and Password are required"
        });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });

        const isValid = await comparePassword(password, user.password);
        if (!isValid) return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });

        const token = generateToken(user);
        const { password: _, ...userData } = user.toObject();

        return res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            user: userData,
            token
        });
    }),

    ForgetPassword: asyncHandler(async (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({
            success: false,
            message: "Email is required"
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) return res.status(400).json({
            success: false,
            message: "Invalid Email"
        });

        const resetPasswordOTP = crypto.randomInt(100000, 999999).toString();
        const resetPassOTPExipres = Date.now() + 600000;

        const user = await User.findOneAndUpdate({ email: email}, {
            $set: {
                resetPasswordOTP,
                resetPassOTPExipres
            }
        }, { new: true});

        if (!user) return res.status(400).json({
            success: false,
            message: "Invalid Email"
        });

        const mail = {
            to: user.email,
            subject: "Password Reset OTP",
            text: `Password Reset OTP: ${resetPasswordOTP}`
        };

        await sendEmail(mail);
        return res.status(200).json({
            success: true,
            message: `Password Reset OTP is sent to the ${email}`
        });
    }),

    ResetPassword: asyncHandler(async (req, res) => {
        const { resetPasswordOTP, newPassword } = req.body;
        if ( !resetPasswordOTP || !newPassword ) return res.status(400).json({
            success: false,
            message: "resetPasswordOTP and newPassword both are required"
        });

        const { error } = validateUserData.ResetPassowrd.validate({
            newPassword
        });

        if (error) return res.status(400).json({
            success: false,
            message: "Weak Password, Doesn't match system standards",
            error: error.details[0].message
        });

        const user = await User.findOne({
            resetPasswordOTP,
            resetPassOTPExipres: { $gt: Date.now() }
        });

        if (!user) return res.status(401).json({
            success: false,
            message: "Invalid Token or Token Expired"
        });

        const hashedPassword = await bcryptTasks.hashPassword(newPassword);
        
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPassOTPExipres =  undefined;
        
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }),
}

export default UserController;