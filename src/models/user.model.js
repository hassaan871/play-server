import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    descritpion: {
        type: String
    },
    avatar: {
        type: String,
        // required: true
    },
    coverImage: {
        type: String
    },
    videoWatermark: {
        type: String
    },
    contactInfo: {
        email: { type: String }
    },
    links: [
        {
            title: { type: String },
            url: { type: String }
        }
    ],
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isAdmin: {
        type: Boolean,
        requried: true,
        // enum: ['admin', 'user'],
        default: false
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false,
        requried: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
    resetPasswordOTP: {
        type: String
    },
    resetPassOTPExipres: {
        type: Date
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
