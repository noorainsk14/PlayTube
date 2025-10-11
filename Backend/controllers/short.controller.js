import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Short } from "../models/Short.model.js";
import { Channel } from "../models/Channel.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";

const uploadShort = asyncHandler(async (req, res) => {
  const { title, description, channelId, tags } = req.body;

  if (!title || !req.file || !channelId) {
    throw new ApiError(400, "title and channelId is required !!");
  }

  const channelData = await Channel.findById(channelId);

  if (!channelData) {
    throw new ApiError(404, "channel not found !!");
  }

  const uploadShort = await uploadOnCloudinary(req.file.path);

  const short = uploadShort.secure_url;

  const newShort = await Short.create({
    channel: channelData._id,
    title: title,
    description,
    shortUrl: short,
    tags: tags ? JSON.parse(tags) : [],
  });

  await Channel.findByIdAndUpdate(
    channelData._id,
    {
      $push: { shorts: newShort._id },
    },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, newShort, "Short uploaded successfully !!"));
});

const getAllShorts = asyncHandler(async (req, res) => {
  const shorts = await Short.find().sort({ createdAt: -1 }).populate("channel comments.author comments.replies.author");

  if (!shorts) {
    throw new ApiError(400, "Shorts are not found !!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { shorts }, "Shorts fetch successfully !!"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    throw new ApiError(400, "Invalid shortId");
  }

  const short = await Short.findById(shortId).populate("channel");

  if (!short) {
    throw new ApiError(404, "short not found !!");
  }

  let isLiked = false;

  if (short.likes.includes(userId)) {
    short.likes.pull(userId);
    isLiked = false;
  } else {
    short.likes.push(userId);
    isLiked = true;
    if (short.disLikes.includes(userId)) {
      short.disLikes.pull(userId);
    }
  }

  await short.populate("comments.author", "username avatar email");
  await short.populate("channel");
  await short.populate("comments.replies.author", "username avatar");

  await short.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { short },
        isLiked ? "Short Liked !!" : "Like removed !!"
      )
    );
});

const toggleDisLike = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    throw new ApiError(400, "Invalid shortId");
  }

  const short = await Short.findById(shortId).populate("channel");
  if (!short) {
    throw new ApiError(404, "short not found !!");
  }

  let isDisLiked = false;

  if (short.disLikes.includes(userId)) {
    short.disLikes.pull(userId);
    isDisLiked = false;
  } else {
    short.disLikes.push(userId);
    isDisLiked = true;
    if (short.likes.includes(userId)) {
      short.likes.pull(userId);
    }
  }

  await short.populate("comments.author", "username avatar email");
  await short.populate("channel");
  await short.populate("comments.replies.author", "username avatar");
  await short.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { short },
        isDisLiked ? "You disliked the short " : "Removed your dislike"
      )
    );
});

const toggleSave = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    throw new ApiError(400, "Invalid shortId");
  }

  const short = await Short.findById(shortId).populate("channel");

  if (!short) {
    throw new ApiError(404, "short not found !!");
  }

  let isSaved = false;

  if (short.savedBy.includes(userId)) {
    short.savedBy.pull(userId);
    isSaved = false;
  } else {
    short.savedBy.push(userId);
    isSaved = true;
  }

  await short.populate("comments.author", "username avatar email");
  await short.populate("channel");
  await short.populate("comments.replies.author", "username avatar");
  await short.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { short },
        isSaved ? "short saved !!" : "short removed from saved list !!"
      )
    );
});

const getViews = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(shortId)) {
    throw new ApiError(400, "Invalid shortId");
  }

  const short = await Short.findByIdAndUpdate(
    shortId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  ).populate("channel");

  if (!short) {
    throw new ApiError(404, "short not found !!");
  }

   await short.populate("comments.author", "username avatar email");
  await short.populate("channel");
  await short.populate("comments.replies.author", "username avatar");

  return res.status(200).json(new ApiResponse(200, { short }, "View added !!"));
});

const addComment = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const { message } = req.body;
  const userId = req.user?._id;

  const short = await Short.findById(shortId);
  if (!short) {
    throw new ApiError(400, "short not found !");
  }

  short?.comments.push({
    author: userId,
    message,
  });

  await short.save();

  await short.populate("comments.author", "username avatar email");
  await short.populate("channel");
  await short.populate("comments.replies.author", "username avatar email");

  return res
    .status(201)
    .json(new ApiResponse(201, { short}, "Comment added !!"));
});

const addReply = asyncHandler(async (req, res) => {
  const { shortId, commentId } = req.params;
  const { message } = req.body;
  const userId = req.user?._id;

  const short = await Short.findById(shortId);
  if (!short) {
    throw new ApiError(400, "short not found !");
  }

  const comment = await short.comments.id(commentId);
  console.log("comment =", comment);
  if (!comment) {
    throw new ApiError(404, "Comment not found !");
  }

  comment.replies.push({ author: userId, message });

  await short.save();

   await short.populate("comments.author", "username avatar email");
  await short.populate("channel");
  await short.populate("comments.replies.author", "username avatar email");

  return res
    .status(201)
    .json(new ApiResponse(201, { short }, "Reply added !!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const short = await Short.findById(shortId)
    .populate("channel", "name avatar subscribers")
    .populate({
      path: "comments.author",
      select: "username avatar email",
    })
    .populate({
      path: "comments.replies.author",
      select: "username avatar email",
    });

  if (!short) {
    throw new ApiError(404, "short not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { short }, "short fetched successfully"));
});

export {
  uploadShort,
  getAllShorts,
  toggleLike,
  toggleDisLike,
  toggleSave,
  getViews,
  addComment,
  addReply,
  getVideoById,
};
