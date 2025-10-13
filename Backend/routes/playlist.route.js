import {Router} from "express"
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createPlaylist, toggleSavePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJwt, createPlaylist)
router.route("/toggle-save").post(verifyJwt, toggleSavePlaylist)

export default router