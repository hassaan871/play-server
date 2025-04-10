import userRoutes from "./user.routes.js";

import express from "express";
const routes = express.Router();

routes.use('/v1/user', userRoutes);

export default routes;