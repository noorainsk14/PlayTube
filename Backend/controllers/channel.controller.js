import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { Channel } from "../models/Channel.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Playlist } from "../models/Playlist.model.js";

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
    coverImage = uploadedCoverImage?.secure_url;
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

const getChannelData = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Extract just the user ID
  console.log("channel user", userId);
  console.log("User from JWT middleware:", req.user);

  const channel = await Channel.findOne({ owner: userId })
    .populate("owner")
    .populate("videos")
    .populate("shorts");

  if (!channel) {
    throw new ApiError(404, "Channel is not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { channel }, "Channel fetched successfully!"));
});

const updateChannel = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;
  const userId = req.user?._id || req.userId;

  const channel = await Channel.findOne({ owner: userId });
  if (!channel) {
    throw new ApiError(404, "Channel not found !!");
  }

  if (name && name !== channel.name) {
    const nameExist = await Channel.findOne({ name });
    if (nameExist) {
      throw new ApiError(400, "Channel name already taken !!");
    }
    channel.name = name;
  }

  if (description !== undefined) {
    channel.description = description;
  }

  if (category !== undefined) {
    channel.category = category;
  }

  if (req.files?.avatar) {
    const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    channel.avatar = avatar?.secure_url;
  }

  if (req.files?.coverImage) {
    const coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    channel.coverImage = coverImage?.secure_url;
  }

  const updatedChannel = await channel.save();

  const userUpdateData = {};
  if (name) userUpdateData.username = name;
  if (channel.avatar) userUpdateData.avatar = channel.avatar;

  if (Object.keys(userUpdateData).length > 0) {
    await User.findByIdAndUpdate(userId, userUpdateData, { new: true });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedChannel },
        "Channel updated successfully !!"
      )
    );
});

const toggleSubscribe = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  const userId = req.user._id;

  if (!channelId) {
    throw new ApiError(404, "Channel id is required !!");
  }

  const channel = await Channel.findById(channelId);

  if (!channel) {
    throw new ApiError(404, "channel not found !!");
  }

  const isSubscribed = channel?.subscribers?.includes(userId);

  if (isSubscribed) {
    channel?.subscribers.pull(userId);
  } else {
    channel?.subscribers.push(userId);
  }

  await channel.save();

  const updatedChannel = await Channel.findById(channelId)
    .populate("owner")
    .populate("videos")
    .populate("shorts");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedChannel },
        isSubscribed
          ? "Unsubscribed from the channel successfully!"
          : "Subscribed to the channel successfully!"
      )
    );
});

const getAllChannelData = asyncHandler(async (req, res) => {
  const channels = await Channel.find()
    .populate("videos")
    .populate("shorts")
    .populate("subscribers")
    .populate({
      path: "communityPost",
      populate: [
        {
          path: "channel",
          model: "Channel",
        },
        {
          path: "comments.author",
          model: "User",
          select: "username avatar",
        },
        {
          path: "comments.replies.author",
          model: "User",
          select: "username avatar",
        },
      ],
    })
    .populate({
      path: "playlist",
      populate: {
        path: "videos",
        model: "Video",
        populate: {
          path: "channel",
          model: "Channel",
        },
      },
    })
    .lean();

  if (!channels || channels.length === 0) {
    throw new ApiError(404, "channels are not find");
  }

  return res.status(200).json(new ApiResponse(200, { channels }));
});

const getSubscribedData = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const SubscribedChannels = await Channel.find({ subscribers: userId })
    .populate({
      path: "videos",
      populate: {
        path: "channel",
        select: "name avatar",
      },
    })
    .populate({
      path: "shorts",
      populate: {
        path: "channel",
        select: "name avatar",
      },
    })
    .populate({
      path: "playlist",
      populate: {
        path: "channel",
        select: "name avatar",
      },
      populate: {
        path: "videos",
        populate: { path: "channel" },
      },
    })
    .populate({
      path: "communityPost",
      populate: [{path: "channel", select : "name avatar"},
      {path: "comments.author", select :"usename avatar email"},
      {path: "comments.replies.author", select :"usename avatar email"},
    
    ]

    })

  if (!SubscribedChannels || SubscribedChannels.length === 0) {
    throw new ApiError(404, "Failed to find subscribed channels");
  }

  const videos = SubscribedChannels.flatMap((ch) => ch.videos);
  const shorts = SubscribedChannels.flatMap((ch) => ch.shorts);
  const playlist = SubscribedChannels.flatMap((ch) => ch.playlist);
  const Post = SubscribedChannels.flatMap((ch) => ch.communityPost);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { SubscribedChannels, videos, shorts, playlist, Post },
        "subscribed cheenel response"
      )
    );
});



export {
  createChannel,
  getChannelData,
  updateChannel,
  toggleSubscribe,
  getAllChannelData,
  getSubscribedData,
};
