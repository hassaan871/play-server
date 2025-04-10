import express from "express";
const routes = express.Router();

import upload from "../middleware/multer.middleware.js";
import UserController from "../controllers/user.controller.js";
const {
    SignUp,
    Login
} = UserController


routes.post('/signup', SignUp);
routes.post('/login', Login);


export default routes;
