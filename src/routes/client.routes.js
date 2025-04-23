import express from "express";
const routes = express.Router();

import clientAuth from "../middleware/clientAuth.middleware.js";

routes.get('/login', (req, res) => res.render('login'));
routes.get('/signup', (req, res) => res.render('signup'));
routes.get('/home', [clientAuth],(req, res) => res.render('home'));

export default routes;