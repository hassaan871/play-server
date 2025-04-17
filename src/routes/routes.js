import userRoutes from "./user.routes.js";
import adminRoutes from "./admin.routes.js";

import express from "express";
const routes = express.Router();

routes.use('/v1/user', userRoutes);
routes.use('/v1/admin', adminRoutes);

export default routes;