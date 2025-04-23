import express from "express";
const routes = express.Router();

routes.get('/login', (req, res) => res.render('login'));
routes.get('/signup', (req, res) => res.render('signup'));
routes.get('/home', (req, res) => res.render('home'));

export default routes;