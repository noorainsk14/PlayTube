import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { Channel } from "../models/Channel.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const createChannel = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;
  const userId = req.user?._id || req.userId;
  console.log("Creating channel for userId:", req.userId);

  const existingChannel = await Channel.findOne({ owner: userId });
  if (existingChannel) {
    throw new ApiError(400, "User already has a channel");
  }

  const nameExist = await Channel.findOne({ name });
  if (nameExist) {
    throw new ApiError(400, "Channel name already taken");
  }

  let avatar;
  let coverImage;

  if (req.files?.avatar) {
    const uploadedAvatar = await uploadOnCloudinary(req.files.avatar[0].path);
    avatar = uploadedAvatar?.secure_url; // ✅ extract only the URL
  }

  if (req.files?.coverImage) {
    const uploadedCoverImage = await uploadOnCloudinary(
      req.files.coverImage[0].path
    );
    coverImage = uploadedCoverImage?.secure_url; // ✅ extract only the URL
  }

  const createdChannel = await Channel.create({
    name,
    description,
    category,
    avatar,
    coverImage,
    owner: userId,
  });

  // Populate the owner field after creation
  const channel = await Channel.findById(createdChannel._id).populate(
    "owner",
    "-password -refreshToken"
  );

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
