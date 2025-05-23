import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINAY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resource_type) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type });
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Failed to Upload on Cloudinary");
        console.error(error);

        fs.unlinkSync(localFilePath);
        return null;
    }
}

export { uploadOnCloudinary };