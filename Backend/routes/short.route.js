import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { getAllShorts, uploadShort } from "../controllers/short.controller.js";

const router = Router();

router.route("/upload-short").post(verifyJwt, upload.single("short"), uploadShort)

router.route("/get-shorts").get(verifyJwt, getAllShorts)
export default router