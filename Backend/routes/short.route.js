import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  addComment,
  addReply,
  getAllShorts,
  getLikedShorts,
  getVideoById,
  getViews,
  toggleDisLike,
  toggleLike,
  toggleSave,
  uploadShort,
} from "../controllers/short.controller.js";

const router = Router();

router
  .route("/upload-short")
  .post(verifyJwt, upload.single("short"), uploadShort);

  //static routes
router.route("/get-shorts").get(verifyJwt, getAllShorts);
router.route("/liked-shorts").get(verifyJwt, getLikedShorts);

//dynamic routes
router.route("/:shortId/toggle-like").put(verifyJwt, toggleLike);
router.route("/:shortId/toggle-dislike").put(verifyJwt, toggleDisLike);
router.route("/:shortId/toggle-save").put(verifyJwt, toggleSave);
router.route("/:shortId/add-view").put(getViews);
router.route("/:shortId/add-comment").post(verifyJwt, addComment);
router.route("/:shortId/:commentId/add-reply").post(verifyJwt, addReply);
router.route("/:shortId/:commentId/add-reply").post(verifyJwt, addReply);
router.route("/:shortId").get(getVideoById);
router.route("/liked-shorts").get(verifyJwt, getLikedShorts);
export default router;
