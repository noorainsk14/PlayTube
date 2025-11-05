import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinaryFromBuffer } from "../config/cloudinary.js";
import { sendMail } from "../config/sendMail.js";
import jwt from "jsonwebtoken";
import { Video } from "../models/Video.model.js";
import { Short } from "../models/Short.model.js";

function escapeRegex(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}

const generateAccessTokenAndRefreshToken = async (userId) => {
  //console.log("generateAccessTokenAndRefreshToken called with userId:", userId);
  const user = await User.findById(userId);
  if (!user) {
    //console.log("User not found for ID:", userId);
    throw new ApiError(404, "User not found during token generation");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // console.log("Tokens generated for user:", user._id);
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // Normalize email
  const normalizedEmail = email?.toLowerCase().trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  if (
    [fullName, normalizedEmail, username, password].some(
      (field) => !field || field.toString().trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [
      { username: username.toLowerCase().trim() },
      { email: normalizedEmail },
    ],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // Multer memory storage provides the file in req.file.buffer
  const avatarFile = req.file;
  if (!avatarFile) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload to Cloudinary from buffer
  const avatar = await uploadOnCloudinaryFromBuffer(avatarFile.buffer);
  if (!avatar?.secure_url) {
    throw new ApiError(500, "Failed to upload Avatar");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase().trim(),
    email: normalizedEmail,
    password,
    avatar: avatar.secure_url, // store HTTPS URL directly
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(400, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});


const logIn = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(404, "username or email are required");
  }

  // Normalize email and username
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    $or: [
      { username: username?.toLowerCase().trim() },
      { email: normalizedEmail },
    ],
  });

  if (!user) {
    throw new ApiError(401, "User does not exist with this email or username");
  }

  const validPassword = await user.isPasswordCorrect(password);

  if (!validPassword) {
    throw new ApiError(404, "Invalid password");
  }

  // Generate tokens
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // ✅ Unified cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  // Remove refreshToken from DB
  if (req.user?._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
  }

  // ✅ Use same cookie options as login for clearing
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorize access!");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(401, "password does not match!");
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Old password!");
  }

  user.password = password;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, "Password change successfully"));
});

const currentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetch successfully !"));
});

const googleAuth = asyncHandler(async (req, res) => {
  const { username, email, avatar, fullName } = req.body;

  if (!email || !username || !avatar || !fullName) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields for Google auth.",
    });
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  };

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  let cloudinaryUrl = avatar;

  if (avatar && !avatar.startsWith("http")) {
    try {
      const uploaded = await uploadOnCloudinary(avatar);
      if (uploaded && uploaded.secure_url) {
        cloudinaryUrl = uploaded.secure_url;
      }
    } catch (error) {
      console.log(" Cloudinary upload failed:", error.message);
    }
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      username,
      email,
      fullName,
      avatar: cloudinaryUrl,
    });
  } else {
    if (!user.avatar && cloudinaryUrl) {
      user.avatar = cloudinaryUrl;
      await user.save({ validateBeforeSave: false });
    }
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
          },
          accessToken,
          refreshToken,
        },
        "Google Authentication successful!"
      )
    );
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User does not found");
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  user.resetOtp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  user.isOtpVerified = false;

  await user.save();

  await sendMail(email, otp);
  return res.status(200).json(new ApiResponse(200, "Otp send successfully"));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.resetOtp = undefined;
  user.otpExpires = undefined;
  user.isOtpVerified = true;

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Otp verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !user.isOtpVerified) {
    throw new ApiError(400, "OTP verification required");
  }

  user.password = password;
  user.isOtpVerified = false;

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));
});

const getRecommendedContent = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(404, "Unauthorized access");
  }

  const user = await User.findById(userId)
    .populate("history.contentId")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Escape special characters in regex
  const escapeRegex = (str) => {
    return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  };

  // Collect keywords from history
  const historyKeyword = user.history.map((h) => h.contentId?.title || "");

  // Collect liked and saved content
  const likedVideos = await Video.find({ likes: userId });
  const likedShorts = await Short.find({ likes: userId });
  const savedVideos = await Video.find({ savedBy: userId });
  const savedShorts = await Short.find({ savedBy: userId });

  const likedSavedKeyword = [
    ...likedVideos.map((v) => v.title),
    ...likedShorts.map((s) => s.title),
    ...savedVideos.map((v) => v.title),
    ...savedShorts.map((s) => s.title),
  ];

  // Merge all keywords and clean them
  const allKeyWords = [...new Set(
    [...historyKeyword, ...likedSavedKeyword]
      .filter(Boolean)
      .flatMap((k) => k.split(" "))
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 1)
  )];

  // Build regex conditions
  const videoConditions = [];
  const shortConditions = [];

  allKeyWords.forEach((kw) => {
    const safeKw = escapeRegex(kw);

    videoConditions.push(
      { title: { $regex: safeKw, $options: "i" } },
      { description: { $regex: safeKw, $options: "i" } },
      { tags: { $regex: safeKw, $options: "i" } }
    );

    shortConditions.push(
      { title: { $regex: safeKw, $options: "i" } },
      { tags: { $regex: safeKw, $options: "i" } }
    );
  });

  // Fetch recommended content
  const recommendedVideos = await Video.find({ $or: videoConditions })
    .populate("channel comments.author comments.replies.author");

  const recommendedShorts = await Short.find({ $or: shortConditions })
    .populate("channel", "name avatar")
    .populate("likes", "username avatar");

  // Get IDs of recommended content
  const recommendedVideoIds = recommendedVideos.map((v) => v._id);
  const recommendedShortIds = recommendedShorts.map((s) => s._id);

  // Get remaining content (not recommended)
  const remainingVideos = await Video.find({
    _id: { $nin: recommendedVideoIds },
  })
    .sort({ createdAt: -1 })
    .populate("channel");

  const remainingShorts = await Short.find({
    _id: { $nin: recommendedShortIds },
  })
    .sort({ createdAt: -1 })
    .populate("channel");

  return res.status(200).json(
    new ApiResponse(200, {
      recommendedVideos,
      recommendedShorts,
      remainingVideos,
      remainingShorts,
      usedKeyword: allKeyWords,
    })
  );
});


export {
  registerUser,
  logIn,
  logOut,
  refreshAccessToken,
  changeCurrentPassword,
  currentUser,
  googleAuth,
  sendOtp,
  verifyOtp,
  resetPassword,
  getRecommendedContent

};
