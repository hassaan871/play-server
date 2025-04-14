import express from "express";
const routes = express.Router();

import upload from "../middleware/multer.middleware.js";
import UserController from "../controllers/user.controller.js";
const {
    SignUp,
    Login,
    ForgetPassword,
    ResetPassword
} = UserController

// Auth
routes.post('/signup', SignUp);
routes.post('/login', Login);

// Password Reset
routes.post('/forget-password', ForgetPassword);
routes.post('/reset-password', ResetPassword);

export default routes;
