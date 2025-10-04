import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { sendMail } from "../config/sendMail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
  //console.log("email :", email);

  // ✅ Normalize email
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
      { username: username.toLowerCase().trim() }, // ✅ lowercase username
      { email: normalizedEmail },
    ],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.file?.path;

  //let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  //const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(404, "Failed to upload Avatar");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    //coverImage: coverImage && coverImage.url ? coverImage.url : "",
    email: normalizedEmail, // ✅ store normalized email
    password,
    username: username.toLowerCase().trim(), // ✅ store lowercase username
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

  // ✅ Normalize email if provided
  const normalizedEmail = email?.toLowerCase().trim();

  const user = await User.findOne({
    $or: [
      { username: username?.toLowerCase().trim() }, // ✅ lowercase username
      { email: normalizedEmail },
    ],
  });

  if (!user) {
    throw new ApiError(401, "User is not existed with this email or password");
  }

  const validPassword = await user.isPasswordCorrect(password);

  if (!validPassword) {
    throw new ApiError(404, "Invalid password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggin successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
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
};
