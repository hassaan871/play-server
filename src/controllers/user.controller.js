import crypto from "crypto";
import User from "../models/user.model.js";
import tokenServices from "../services/jwt.service.js";
import asyncHandler from "../util/asyncHandler.js";
import bcryptTasks from "../util/bcrypt.utility.js";
import { validateUserData } from "../validations/validations.js";
import sendEmail from "../services/sendEmail.service.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";

const { comparePassword, hashPassword } = bcryptTasks;
const { generateToken } = tokenServices;

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


        if (existingUser && existingUser.isDeleted) await User.findByIdAndDelete(existingUser._id);

        if (existingUser && existingUser.isVerified) return res.status(400).json({
            success: false,
            message: "User Already exists"
        });

        if (existingUser && !existingUser.isVerified) await User.findByIdAndDelete(existingUser._id);

        // if(existingUser && !existingUser.isDeleted) return res.status(400).json({
        //     success: false,
        //     message: "User already registered. Please Login."
        // });

        const hashedPassword = await hashPassword(password);

        const verificationToken = crypto.randomInt(100000, 999999).toString();
        const verificationTokenExpires = new Date(Date.now() + 600000);

        const newUser = await User.create({
            username,
            email,
            fullName,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpires,
            isVerified: false
        });

        const mail = {
            to: newUser.email,
            subject: "Email Verification OTP",
            text: `Email Verification OTP: ${verificationToken} \n DON'T SHARE with Anyone`
        };

        await sendEmail(mail);

        // const token = generateToken(newUser);

        const { password: _, ...restData } = newUser.toObject();
        return res.status(201)
            // .header("x-auth-token", token)
            .json({
                success: true,
                message: "User registered please verify your eamil to activate your account. verification email send",
                payload: {
                    user: restData,
                    // token
                }
            });
    }),

    VerifyEmail: asyncHandler(async (req, res) => {
        const { email, verificationToken } = req.body;

        if (!email || !verificationToken) return res.status(400).json({
            success: false,
            message: "email and verificationToken both are required"
        });

        const { error } = validateUserData.EamilVerification.validate({
            email
        });

        if (error) return res.status(400).json({
            success: false,
            message: "Enter a valid email",
            error: error.details[0].message
        });

        const userdb = await User.findOne({ email });

        if(!userdb) return res.status(404).json({
            success: false,
            message: "Invalid Email, or Email not Registered"
        });

        if (userdb.isVerified) return res.status(400).json({
            success: false,
            message: "Email is already verified"
        });

        const user = await User.findOne({
            email,
            verificationToken,
            verificationTokenExpires: { $gt: Date.now() }
        }).select("-password");

        if (!user) return res.status(401).json({
            success: false,
            message: "Invalid email/Token or Token Expired"
        });

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now login.",
            user
        });

    }),

    ResendVerificationEmail: asyncHandler(async (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({
            success: false,
            message: "Email is required"
        });

        const user = await User.findOne(
            {
                email,
                isVerified: false
            }
        );
        // console.log("USEr: ", user);

        // return res.status(200).json({
        //     success: true,
        //     message: "my message",
        //     user: user
        // });
        if (!user) return res.status(404).json({
            success: false,
            message: "User not found or already verified"
        });

        const verificationToken = crypto.randomInt(100000, 999999).toString();
        const verificationTokenExipres = new Date(Date.now() + 600000);

        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExipres;

        await user.save();

        const mail = {
            to: user.email,
            subject: "Email Verification OTP",
            text: `Email Verification OTP: ${verificationToken} \n DON'T SHARE with Anyone`
        };

        await sendEmail(mail);

        return res.status(200).json({
            success: true,
            message: "Verification email sent successfully"
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

        if (!user.isVerified) return res.status(401).json({
            success: false,
            message: "Email is not verified."
        });

        const isValid = await comparePassword(password, user.password);
        if (!isValid) return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        });

        const token = generateToken(user);
        const { password: _, ...userData } = user.toObject();

        return res.status(200).cookie("token", token).header("x-auth-token", token).json({
            success: true,
            message: "Logged in Successfully",
            user: userData,
            token
        });
    }),

    Logout: asyncHandler(async (req, res) => {
        res.clearCookie('token');

        return res.status(200).json({
            success: true,
            message: "Loged out successfully"
        });
    }),

    ForgetPassword: asyncHandler(async (req, res) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({
            success: false,
            message: "Email is required"
        });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({
            success: false,
            message: "Invalid Email"
        });

        const resetPasswordOTP = crypto.randomInt(100000, 999999).toString();
        const resetPassOTPExipres = Date.now() + 600000;

        const user = await User.findOneAndUpdate({ email: email }, {
            $set: {
                resetPasswordOTP,
                resetPassOTPExipres
            }
        }, { new: true });

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
        if (!resetPasswordOTP || !newPassword) return res.status(400).json({
            success: false,
            message: "resetPasswordOTP and newPassword both are required"
        });

        const { error } = validateUserData.ResetPassword.validate({
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
        user.resetPassOTPExipres = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });
    }),

    updateUserAvatar: asyncHandler(async (req, res) => {
        const avatarLocalPath = req.file?.path;
        if (!avatarLocalPath) return res.status(400).json({
            success: false,
            message: "Avatar Image file is missing"
        });

        const avatar = await uploadOnCloudinary(avatarLocalPath, "image");
        if (!avatar.url) return res.status(400).json({
            success: false,
            message: "Error while updating the avatar"
        });

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: { avatar: avatar.url }
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Avatar Image updated successfully",
            user
        });
    }),

    updateUserCoverImage: asyncHandler(async (req, res) => {
        const coverImageLocalPath = req.file?.path;
        if (!coverImageLocalPath) return res.status(400).json({
            success: false,
            message: "Cover Image file is missing"
        });

        const coverImage = await uploadOnCloudinary(coverImageLocalPath, "image");
        if (!coverImage.url) return res.status(400).json({
            success: false,
            message: "Error while updating the cover image"
        });

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: { coverImage: coverImage.url }
            },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Cover Image updated successfully",
            user
        });
    }),

    getCurrentUser: asyncHandler(async (req, res) => {
        const _id = req.user?._id;
        const user = await User.findById(_id).select("-password");

        if (!user) return res.status(404).json({
            success: false,
            message: "User not found. It might have been deleted."
        });

        return res.status(200).json({
            success: true,
            user
        });
    }),

    updateAccountDetails: asyncHandler(async (req, res) => {

        /**
         * Testing for bugs
         */

        // return res.status(200).json({
        //     user: req.user,
        //     // user1: req.user.user || "req.user.user"
        // });
    }),

    deleteCurrentUser: asyncHandler(async (req, res) => {
        const user = await User.findById(req.user?._id);

        if (user.isDeleted) return res.status(400).json({
            success: false,
            message: "user is already deleted."
        });

        user.isDeleted = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User softly deleted successfully"
        });
    })
}

export default UserController;