import express from "express";
const routes = express.Router();

import clientAuth from "../middleware/clientAuth.middleware.js";
import clientAdminAuth from "../middleware/clientAdminAuth.middleware.js";

routes.get('/admin-login', (req, res) => res.render('admin/admin-login'));
routes.get('/admin-home', [clientAuth, clientAdminAuth], (req, res) => res.render('admin/admin-home'));
routes.get('/admin-users', [clientAuth, clientAdminAuth], (req, res) => res.render('admin/admin-users'));

routes.get('/login', (req, res) => res.render('login'));
routes.get('/signup', (req, res) => res.render('signup'));
routes.get('/home', [clientAuth], (req, res) => res.render('home'));

export default routes;