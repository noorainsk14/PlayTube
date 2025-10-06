import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { uploadShort } from "../controllers/short.controller.js";

const router = Router();

router.route("/upload-short").post(verifyJwt, upload.single("short"), uploadShort)

export default router