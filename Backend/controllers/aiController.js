import { GoogleGenAI } from "@google/genai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/Video.model.js";
import { Short } from "../models/Short.model.js";
import { Channel } from "../models/Channel.model.js";
import { Playlist } from "../models/Playlist.model.js";
import "dotenv/config";

export const searchWithAi = asyncHandler(async (req, res) => {
  const { input } = req.body;

  if (!input) {
    throw new ApiError(400, "Search query required");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINIAPI_API_KEY,
  });

  const prompt = `You are a search assistant for a video streaming platform. 
The user query is: "${input}"

💡 Your job:
- If query has typos, correct them.
- If query has multiple words, break them into meaningful keywords.
- Return only the corrected word(s), comma-separated.
- Do not explain, only return keyword(s).`;

let keyword
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log(response.text);

     keyword = (response.text || input).trim().replace(/[\n\r]+/g, "");
  } catch (error) {
    console.error("Gemini API error:", error);
    keyword = input; // fallback to raw input
  }
  const searchWords = keyword
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

  const buildRegexQuery = (fields) => {
    return {
      $or: searchWords.map((word) => ({
        $or: fields.map((field) => ({
          [field]: { $regex: word, $options: "i" },
        })),
      })),
    };
  };

  const matchChannels = await Channel.find(buildRegexQuery(["name"])).select(
    "_id name avatar"
  );

  const ChannelIds = matchChannels.map((c) => c._id);

  const videos = await Video.find({
    $or: [
      buildRegexQuery(["title", "description", "tags"]),
      { channel: { $in: ChannelIds } },
    ],
  }).populate("channel comments.author comments.replies.author");

  const shorts = await Short.find({
    $or: [
      buildRegexQuery(["title", "description", "tags"]),
      { channel: { $in: ChannelIds } },
    ],
  })
    .populate("channel", "name avatar")
    .populate("likes", "username avatar");

  const playlists = await Playlist.find({
    $or: [
      buildRegexQuery(["title", "description"]),
      { channel: { $in: ChannelIds } },
    ],
  })
    .populate("channel", "name avatar")
    .populate({
      path: "videos",
      populate: { path: "channel", select: "name avatar" },
    });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { keyword, channels: matchChannels, videos, shorts, playlists },
        "gemini api search result"
      )
    );
});
