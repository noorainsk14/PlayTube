import { Router } from "express";
import {
  registerUser,
  logIn,
  logOut,
  refreshAccessToken,
  changeCurrentPassword,
  currentUser,
  googleAuth,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/google-auth").post(googleAuth);
router.route("/login").post(logIn);

//secured routes
router.route("/logout").post(verifyJwt, logOut);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/current-user").get(verifyJwt, currentUser);
router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);

export default router;
