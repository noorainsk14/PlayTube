import {Router} from "express"
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComment, createVideo, getAllVideos, getViews, toggleDisLike, toggleLike, toggleSave } from "../controllers/video.controller.js";

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
router.route("/:videoId/toggle-like").put(verifyJwt, toggleLike)
router.route("/:videoId/toggle-dislike").put(verifyJwt, toggleDisLike)
router.route("/:videoId/toggle-save").put(verifyJwt, toggleSave)
router.route("/:videoId/add-view").put( getViews)
router.route("/:videoId/add-comment").post(verifyJwt, addComment)
router.route("/:videoId/:commentId").post(verifyJwt, addComment)
export default router

