import multer from "multer";
import path from "path";

// Base storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        // Deteermine destinatio based on file type
        const destinationPath = file.fieldname.includes('video') ? "./public/temp/videos" : "./public/temp/images";
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Image file filter
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only images files (jpeg, jpg, png) are allowd"));
    }
};

// video file filter
const videoFileFilter = (req, file, cb) => {
    // const allowedTypes = /mp4|mov|avi|mkv|webm/
    const allowedTypes = /mp4/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /video\/.*/.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        // cb(new Error("Only video files (mp4, mov, avi, mkv, webm) are allowed"));
        cb(new Error("Only video files (mp4) are allowed"));
    }
}

const uploadImage = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadVideo = multer({
    storage,
    fileFilter: videoFileFilter,
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

export { uploadImage, uploadVideo };