import dotenv from "dotenv";
dotenv.config({
    // path: "./.env"
});

import connectDB from "./db/dbConnect.js";
import { app } from "./app.js";
import { scheduleCleanupJob, runImmediateCleanup } from "../src/util/cleanup.utility.js";

connectDB()
    .then(() => {

        // Schedule cleanup job for unverified users
        scheduleCleanupJob();

        // Run an immediate cleanup on startup
        runImmediateCleanup();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at PORT: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.error(`MONGODB connection failed !!! ${err}`);
    });