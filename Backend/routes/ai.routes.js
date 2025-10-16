import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { filterCategoyWithAi, searchWithAi } from "../controllers/aiController.js";


const router = Router();

router.route("/search").post(verifyJwt, searchWithAi )
router.route("/filter").post(verifyJwt, filterCategoyWithAi )

export default router;