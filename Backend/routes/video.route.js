import {Router} from "express"
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/upload-video").post( verifyJwt, upload.fields([
    {
        name: "video",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]),
createVideo
)

export default router