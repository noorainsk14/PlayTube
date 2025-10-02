import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { Channel } from "../models/Channel.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { sendMail } from "../config/sendMail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const createChannel = asynHandler(async (req, res) => {
  const { name, description, category } = req.body;
  const userId = req.userId;
  const existingChannel = await Channel.findOne({ owner: userId });

  if (existingChannel) {
    throw new ApiError(400, "User already have a channel");
  }

  const nameExist = await Channel.findOne({ name });

  if (nameExist) {
    throw new ApiError(400, "Channel name already taken");
  }

  let avatar;
  let coverImage;

  if (req.files?.avatar) {
    avatar = await uploadOnCloudinary(req.files.avatar[0].path);
  }

  if (req.files?.coverImage) {
    coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
  }

  const channel = await Channel.create({
    name,
    description,
    category,
    avatar,
    coverImage,
    owner: userId,
  });

  await User.findByIdAndUpdate(userId, {
    channel: channel._id,
    username: name,
    avatar: avatar,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { channel }, "Channel created successfully !!"));
});

export { createChannel };
