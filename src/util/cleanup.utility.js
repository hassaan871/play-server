import User from "../models/user.model";
import cron from "node-cron";


const cleanupUnverifiedUers = async () => {
    try {
        const result = await User.deleteMany({
            isVerified: false,
            verificationTokenExpires: { $lt: new Date() }
        });

        console.log(`Cleanup: Removed ${result.deletedCount} expired unverified user accounts.`)
    } catch (error) {
        console.error(`Error cleaning up unverified users: ${error.message}`);
    }
};

/**
 * Schedules the cleanup job to run on a regular interval
 * @param {string} schedule - cron schedule expression (default: every day at midnight) 
 */

const scheduleCleanupJob = (schedule = "0 0 * * *") => {
    cron.schedule(schedule, cleanupUnverifiedUers);
    console.log("Scheduled cleanup job for unverified users");    
};

/**
 * Run cleanup manually (can be called during application setup)
 */
const runImmediateCleanup = async () => {
    console.log("Running immediate cleanup of expired verification tokens");
    await cleanupUnverifiedUers();   
}

export {
    cleanupUnverifiedUers,
    scheduleCleanupJob,
    runImmediateCleanup
}