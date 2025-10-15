import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { searchWithAi } from "../controllers/aiController.js";


const router = Router();

router.route("/search").post(verifyJwt, searchWithAi )

export default router;