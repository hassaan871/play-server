import express from "express";
const routes = express.Router();

import { uploadImage, uploadVideo } from "../middleware/multer.middleware.js";
import UserController from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
const {
    SignUp,
    Login,
    ForgetPassword,
    ResetPassword,
    updateUserAvatar,
    updateUserCoverImage,
    getCurrentUser,
    updateAccountDetails
} = UserController

// Auth
routes.post('/signup', SignUp);
routes.post('/login', Login);

// Password Reset
routes.post('/forget-password', ForgetPassword);
routes.post('/reset-password', ResetPassword);

// protected routes
routes.patch('/avatar', [auth, uploadImage.single("avatar")], updateUserAvatar);
routes.patch('/coverimage', [auth, uploadVideo.single("coverImage")], updateUserCoverImage);

routes.get('/current', [auth], getCurrentUser);
routes.patch('/update', [auth], updateAccountDetails);

export default routes;
