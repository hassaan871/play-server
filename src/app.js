import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import path from "path";

const app = express();

app.use(cors({
    //     // origin: process.env.CORS_ORIGIN,
    //     origin: 'http://localhost:5173',
    //     credentials: true
}));

app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "src/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use('/api', routes);

export { app }