import express from "express";
const routes = express.Router();

import { uploadImage, uploadVideo } from "../middleware/multer.middleware.js";
import UserController from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const {
    SignUp,
    VerifyEmail,
    ResendVerificationEmail,
    Login,
    ForgetPassword,
    ResetPassword,
    updateUserAvatar,
    updateUserCoverImage,
    getCurrentUser,
    updateAccountDetails,
    deleteCurrentUser
} = UserController;

// Auth
routes.post('/signup', SignUp);
routes.get('/verify-email', VerifyEmail);
routes.post('/login', Login);
routes.post('/resend-verification', ResendVerificationEmail);

// Password Reset
routes.post('/forget-password', ForgetPassword);
routes.post('/reset-password', ResetPassword);

// protected routes
routes.patch('/avatar', [auth, uploadImage.single("avatar")], updateUserAvatar);
routes.patch('/coverimage', [auth, uploadImage.single("coverImage")], updateUserCoverImage);

routes.get('/current', [auth], getCurrentUser);
routes.patch('/update', [auth], updateAccountDetails);
routes.delete('/current', [auth], deleteCurrentUser);

export default routes;
