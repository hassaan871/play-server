import { Parser } from "json2csv";
import path from "path";
import fs from "fs";
import { uploadOnCloudinary } from "./cloudinary.service.js";

const generateCSV = async (data, filename) => {
    try {
        const fields = [
            'username',
            'email',
            'fullName',
            'isAdmin',
            'isVerified',
            'isDeleted',
            'createdAt',
            'updatedAt'
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        const tempCsDir = path.join(process.cwd(), 'temp', 'csv');
        if(!fs.existsSync(tempCsDir)) fs.mkdirSync(tempCsDir, { recursive: true });

        const filePath = path.join(tempCsDir, `${tempCsDir}.csv`);
        fs.writeFileSync(filePath, csv);

        const cloudinaryResponse = await uploadOnCloudinary(filePath, "raw");
        fs.unlinkSync(filePath);

        if(!cloudinaryResponse || !cloudinaryResponse.url) throw new Error("Failed to upload CSV to Cloudinary");

        return cloudinaryResponse.url;        
    } catch (error) {
        console.error(`CSV Genertrion Error: ${error}`);
        throw error;
    }
}

export default generateCSV;