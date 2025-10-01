import nodemailer from "nodemailer";
import "dotenv/config";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.APP_USER,
    to: to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for Password Reset is <b>${otp}<b/> It expires in o5 minutes.</p>`, // HTML body
  });
};

export default sendMail;
