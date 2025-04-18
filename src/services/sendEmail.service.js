import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async ({ to, subject, text }) => {
    try {
        const mailOptions = {
            from: `Support team ${process.env.EMAIL_USER}`,
            to,
            subject,
            text
        }

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error(`Error sending email: ${error}`);
        throw error;
    }
}

export default sendEmail;