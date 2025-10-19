import {Router} from "express"
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addComment, addReply, createPost, deletePost, getAllPost, toggleLike } from "../controllers/post.controller.js";


const router = Router();

//static route
router.route("/create-post").post(verifyJwt, upload.single("image"), createPost)
router.route("/get-post").get(verifyJwt,  getAllPost)
router.route("/toggle-like").post(verifyJwt, toggleLike)
router.route("/toggle-like").post(verifyJwt, toggleLike)
router.route("/add-comment").post(verifyJwt, addComment)
router.route("/add-reply").post(verifyJwt, addReply)

//dynamic route
router.route("/:postId/delete-post").delete(verifyJwt, deletePost)


export default router