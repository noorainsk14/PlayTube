import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import { Video } from "../models/Video.model.js";
import { Channel } from "../models/Channel.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import mongoose from "mongoose";

const createVideo = asyncHandler(async (req, res) => {
  const { title, description, channelId, tags } = req.body;

  if (!title || !req.files?.video || !req.files?.thumbnail || !channelId) {
    throw new ApiError(
      400,
      "title, video, thumbnail, and channelId are required"
    );
  }

  const channelData = await Channel.findById(channelId);

  if (!channelData) {
    throw new ApiError(400, "Channel not found !!");
  }

  const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
  const video = uploadVideo?.secure_url;

  const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);
  const thumbnail = uploadThumbnail?.secure_url;

  let parsedTag = [];
  if (tags) {
    try {
      parsedTag = JSON.parse(tags);
    } catch (error) {
      parsedTag = [];
    }
  }

  const newVideo = await Video.create({
    title,
    channel: channelData._id,
    description,
    videoUrl: video,
    thumbnail: thumbnail,
    tags: parsedTag,
  });

  await Channel.findByIdAndUpdate(
    channelData._id,
    { $push: { videos: newVideo._id } },
    { new: true }
  );

  return res
    .status(201)
    .json(new ApiResponse(201, { newVideo }, "Video uploaded successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 }).populate("channel comments.author comments.replies.author");

  if (!videos) {
    throw new ApiError(400, "Videos are not found !!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Videos fetch successfully !!"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId).populate("channel");

  if (!video) {
    throw new ApiError(404, "video not found !!");
  }

  let isLiked = false;

  if (video.likes.includes(userId)) {
    video.likes.pull(userId);
    isLiked = false;
  } else {
    video.likes.push(userId);
    isLiked = true;
    if (video.disLikes.includes(userId)) {
      video.disLikes.pull(userId);
    }
  }

  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video },
        isLiked ? "Video Liked !!" : "Like removed !!"
      )
    );
});

const toggleDisLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId).populate("channel");
  if (!video) {
    throw new ApiError(404, "video not found !!");
  }

  let isDisLiked = false;

  if (video.disLikes.includes(userId)) {
    video.disLikes.pull(userId);
    isDisLiked = false;
  } else {
    video.disLikes.push(userId);
    isDisLiked = true;
    if (video.likes.includes(userId)) {
      video.likes.pull(userId);
    }
  }

  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video },
        isDisLiked ? "You disliked the video " : "Removed your dislike"
      )
    );
});

const toggleSave = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId).populate("channel");

  if (!video) {
    throw new ApiError(404, "video not found !!");
  }

  let isSaved = false;

  if (video.savedBy.includes(userId)) {
    video.savedBy.pull(userId);
    isSaved = false;
  } else {
    video.savedBy.push(userId);
    isSaved = true;
  }

  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video },
        isSaved ? "Video saved !!" : "Video removed from saved list !!"
      )
    );
});

const getViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  ).populate("channel");

  if (!video) {
    throw new ApiError(404, "Video not found !!");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, { video }, "View added !!"));
});

const addComment = asyncHandler(async(req, res) => {
  const {videoId} = req.params;
  const {message} = req.body;
  const userId = req.user?._id

  const video = await Video.findById(videoId)
  if(!video){
    throw new ApiError(400, "Video not found !")
  }

  video?.comments.push({
    author: userId,
    message
  })

  video.save();

  const populatedVideo = await Video.findById(videoId).populate({path: "comments.author", select : "username avatar email"}).populate({path: "comments.replies.author", select: "usename avatar email"})
  

  return res.status(201).json(
     new ApiResponse(201, {populatedVideo}, "Comment added !!")
  )
})

const addReply = asyncHandler(async(req, res) => {
  const {videoId, commentId} = req.params;
  const {message} = req.body;
  const userId = req.user?._id

  const video = await Video.findById(videoId)
  if(!video){
    throw new ApiError(400, "Video not found !")
  }

  const comment = await  video.comments.id(commentId)
  if(!comment){
    throw new ApiError(404, "Comment not found !")
  }

  comment.replies.push({author:userId, message})

  await video.save()

  const populatedVideo = await Video.findById(videoId).populate({path: "comments.author", select : "username avatar email"}).populate({path: "comments.replies.author", select: "usename avatar email"})

  return res
  .status(201)
  .json(
    new ApiResponse(201,{populatedVideo},"Reply added !!")
  )



})

export {
  createVideo,
  getAllVideos,
  toggleLike,
  toggleDisLike,
  toggleSave,
  getViews,
  addComment,
  addReply
};
