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

    avatar: {
        type: String,
        // required: true
    },

    coverImage: {
        type: String
    },

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
        type: String,
        requried: true,
        enum: ['admin', 'user'],
        default: 'user'
    }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
