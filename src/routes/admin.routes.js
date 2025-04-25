import express from "express";
const routes = express.Router();

import auth from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";
import AdminController from "../controllers/admin.controller.js";

const {
    adminLogin,
    Logout,
    getAllUsers,
    getUnverifiedUsers,
    getVerifiedUsers,
    getAllDeletedUsers,
    getAllUsersCsv,
    getVerifiedUsersCsv,
    getUnverifiedUsersCsv,
    getAllDeletedUsersCsv
} = AdminController;

routes.post('/login', adminLogin);
routes.post('/logout', Logout);

// Apply auth and admin middleware to all routes
routes.use([auth, isAdmin]);

routes.get('/users/all', getAllUsers);
routes.get('/users/verified', getVerifiedUsers);
routes.get('/users/unverified', getUnverifiedUsers);
routes.get('/users/deleted', getAllDeletedUsers);

routes.get('/users/csv/all', getAllUsersCsv);
routes.get('/users/csv/verified', getVerifiedUsersCsv);
routes.get('/users/csv/unverified', getUnverifiedUsersCsv);
routes.get('/users/csv/deleted', getAllDeletedUsersCsv);

export default routes;