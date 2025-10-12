import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import {
  createChannel,
  getAllChannelData,
  getChannelData,
  toggleSubscribe,
  updateChannel,
} from "../controllers/channel.controller.js";

const router = Router();

router.route("/create-channel").post(
  verifyJwt,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  createChannel
);

router.route("/get-channel").get(verifyJwt, getChannelData);

router.route("/update-channel").patch(
  verifyJwt,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  updateChannel
);

router.route("/toggle-subscribe").post(verifyJwt, toggleSubscribe)
router.route("/get-allChannel").get(getAllChannelData)

export default router;
