import {Router} from "express"
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createVideo, getAllVideos } from "../controllers/video.controller.js";

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

router.route("/get-videos").get(verifyJwt, getAllVideos)
export default router