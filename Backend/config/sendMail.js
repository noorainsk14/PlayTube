import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false = use STARTTLS
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: `"PlayTube" <${process.env.APP_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for Password Reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};

export { sendMail };
