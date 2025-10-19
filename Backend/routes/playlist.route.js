import {Router} from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createPlaylist, deletePlaylist, fetchPlaylist, getSavedPlaylist, toggleSavePlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router();

//static route
router.route("/create-playlist").post(verifyJwt, createPlaylist)
router.route("/toggle-save").post(verifyJwt, toggleSavePlaylist)
router.route("/saved-playlist").get(verifyJwt, getSavedPlaylist)

//dynamic route
router.route("/:playlistId/fetch-playlist").get(fetchPlaylist);
router.route("/:playlistId/update-playlist").post(  verifyJwt,  updatePlaylist);
router.route("/:playlistId/delete-playlist").delete(verifyJwt, deletePlaylist);


export default router