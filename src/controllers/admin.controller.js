import User from "../models/user.model.js";
import asyncHandler from "../util/asyncHandler.js";
import generateCSV from "../services/csv.service.js";

const AdminController = {
    getAllUsers: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 3;
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit).select("-password");
        if (!users || users.length === 0) return res.status(404).json({
            success: false,
            message: "No users found"
        });

        return res.status(200).json(users);
    }),

    getVerifiedUsers: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 3;
        const skip = (page - 1) * limit;

        const verifiedUsers = await User.find({
            isVerified: true,
            isDeleted: false
        })
            .skip(skip)
            .limit(limit)
            .select("-password -verificationToken -verificatioTokenExpires -resetPasswordOTP -resetPassOTPExipres");
        if (!verifiedUsers || verifiedUsers.length === 0) return res.status(404).json({
            success: false,
            message: "No verified users found"
        });

        return res.status(200).json(verifiedUsers);
    }),

    getUnverifiedUsers: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 3;
        const skip = (page - 1) * limit;

        const unverifiedUsers = await User.find({
            isVerified: false,
            isDeleted: false
        })
            .skip(skip)
            .limit(limit)
            .select("-password -verificaitionToken -verificationTokenExpires -resetPasswordOTP -resetPassOTPExipres");
        if (!unverifiedUsers || unverifiedUsers.length === 0) return res.status(404).json({
            success: false,
            message: "No Unverified users found"
        });

        return res.status(200).json(unverifiedUsers);
    }),

    getAllDeletedUsers: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 3;
        const skip = (page - 1) * limit;

        const deletedUsers = await User.find({
            isDeleted: true
        })
            .skip(skip)
            .limit(limit)
            .select("-password -verificatioToken -verificationTokenExpires -resetPasswordOTP -resetPassOTPExipres");
        if (!deletedUsers || deletedUsers.length === 0) return res.status(404).json({
            success: false,
            message: "No deleted user found"
        });

        return res.status(200).json(deletedUsers);
    }),

    getAllUsersCsv: asyncHandler(async (req, res) => {
        const users = await User.find({ isDeleted: false })
            .select("-password -verificationToken -verificationTokenExpires -resetPasswordOTP -resetPassOTPExpires")
            .lean();

        if (!users || users.length === 0) return res.status(404).json({
            success: false,
            message: "No users found"
        });

        const timestamp = Date.now();
        const filename = `all_users_${timestamp}.csv`;

        const csvUrl = await generateCSV(users, filename);

        return res.status(200).json({
            success: true,
            message: "All users CSV generated successfully",
            count: users.length,
            csvUrl
        });
    }),

    getVerifiedUsersCsv: asyncHandler(async (req, res) => {
        const users = await User.find({
            isVerified: true,
            isDeleted: false
        })
            .select("-password -verificationToken -verificationTokenExpires -resetPasswordOTP -resetPassOTPExpires")
            .lean();

        if (!users || users.length === 0) return res.status(404).json({
            success: false,
            message: "No verified users found"
        });

        const timestamp = Date.now();
        const filename = `verified_users_${timestamp}.csv`;

        const csvUrl = await generateCSV(users, filename);

        return res.status(200).json({
            success: true,
            message: "All verified users CSV generated successfully",
            count: users.length,
            csvUrl
        });
    }),

    getUnverifiedUsersCsv: asyncHandler(async (req, res) => {
        const users = await User.find({
            isVerified: false,
            isDeleted: false
        })
            .select("-password -verificationToken -verificationTokenExpires -resetPasswordOTP -resetPassOTPExpires")
            .lean();

        if (!users || users.length === 0) return res.status(404).json({
            success: false,
            message: "No unverified users found"
        });

        const timestamp = Date.now();
        const filename = `verified_users_${timestamp}.csv`;

        const csvUrl = await generateCSV(users, filename);

        return res.status(200).json({
            success: true,
            message: "All unverified users CSV generated successfully",
            count: users.length,
            csvUrl
        });
    }),

    getAllDeletedUsersCsv: asyncHandler(async (req, res) => {
        const users = await User.find({
            isDeleted: true,
            isVerified: false
        })
            .select("-password -verificationToken -verificationTokenExpires -resetPasswordOTP -resetPassOTPExpires")
            .lean();

        if (!users || users.length === 0) return res.status(404).json({
            success: false,
            message: "No deleted users found"
        });

        const timestamp = Date.now();
        const filename = `verified_users_${timestamp}.csv`;

        const csvUrl = await generateCSV(users, filename);

        return res.status(200).json({
            success: true,
            message: "All deleted users CSV generated successfully",
            count: users.length,
            csvUrl
        });
    })
};

export default AdminController;