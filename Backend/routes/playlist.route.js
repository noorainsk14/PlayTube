import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createPlaylist, getSavedPlaylist, toggleSavePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.route("/create-playlist").post(verifyJwt, createPlaylist)
router.route("/toggle-save").post(verifyJwt, toggleSavePlaylist)
router.route("/saved-playlist").get(verifyJwt, getSavedPlaylist)

export default router