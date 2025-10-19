import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  addComment,
  addReply,
  deleteShort,
  fetchShort,
  getAllShorts,
  getLikedShorts,
  getSavedShorts,
  getVideoById,
  getViews,
  toggleDisLike,
  toggleLike,
  toggleSave,
  updateShort,
  uploadShort,
} from "../controllers/short.controller.js";

const router = Router();

//static routes
router
  .route("/upload-short")
  .post(verifyJwt, upload.single("short"), uploadShort);
router.route("/get-shorts").get(verifyJwt, getAllShorts);
router.route("/liked-shorts").get(verifyJwt, getLikedShorts);
router.route("/saved-shorts").get(verifyJwt, getSavedShorts);

//dynamic routes
router.route("/:shortId/toggle-like").put(verifyJwt, toggleLike);
router.route("/:shortId/toggle-dislike").put(verifyJwt, toggleDisLike);
router.route("/:shortId/toggle-save").put(verifyJwt, toggleSave);
router.route("/:shortId/add-view").put(getViews);
router.route("/:shortId/add-comment").post(verifyJwt, addComment);
router.route("/:shortId/:commentId/add-reply").post(verifyJwt, addReply);
router.route("/:shortId/:commentId/add-reply").post(verifyJwt, addReply);
router.route("/:shortId").get(getVideoById);
router.route("/:shortId/fetch-short").get(fetchShort);
router.route("/:shortId/update-short").post(  verifyJwt,  updateShort);
router.route("/:shortId/delete-short").delete(verifyJwt, deleteShort);
export default router;
