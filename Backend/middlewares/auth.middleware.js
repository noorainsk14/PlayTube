import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    // 1. Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      // 401 Unauthorized is more appropriate
      throw new ApiError(401, "Unauthorized access: No token provided");
    }

    // 2. Verify the token using the secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decodedToken);

    // 3. Check if _id is valid ObjectId
    if (
      !decodedToken._id ||
      !mongoose.Types.ObjectId.isValid(decodedToken._id)
    ) {
      throw new ApiError(401, "Invalid token: User ID is not valid");
    }

    // 4. Fetch user from database without password and refreshToken
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token: User not found");
    }

    // 5. Attach user to req object
    req.user = user;

    next();
  } catch (error) {
    console.error("verifyJwt middleware error:", error.message);
    // Forward error with 401 Unauthorized status
    next(new ApiError(401, error.message || "Invalid access token"));
  }
});
