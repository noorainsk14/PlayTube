import { GoogleGenAI } from "@google/genai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/Video.model.js";
import { Short } from "../models/Short.model.js";
import { Channel } from "../models/Channel.model.js";
import { Playlist } from "../models/Playlist.model.js";
import "dotenv/config";

const searchWithAi = asyncHandler(async (req, res) => {
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

  let keyword;
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

const filterCategoyWithAi = asyncHandler(async (req, res) => {
  const { input } = req.body;

  if (!input) {
    throw new ApiError(400, "Search query required");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINIAPI_API_KEY,
  });

  const categories = [
    "Music",
    "Gaming",
    "Movies",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs",
  ];

  const prompt = `You are a category classifier for a video streaming platform.

The user query is: "${input}"

🎯 Your job:
- Match this query with the most relevant categories from this list:
${categories.join(", ")}
- If more than one category fits, return them comma-separated.
- If nothing fits, return the single closest category.
- Do NOT explain. Do NOT return JSON. Only return category names.

Examples:
- "arijit singh songs" -> "Music"
- "pubg gameplay" -> "Gaming"
- "netflix web series" -> "TV Shows"
- "india latest news" -> "News"
- "funny animal videos" -> "Comedy, Pets"
- "fitness tips" -> "Education, Sports"
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const keywordText = response.text.trim();
  const keywords = keywordText.split(",").map((k) => k.trim());

  const videoConditions = [];
  const shortConditions = [];
  const channelConditions = [];

  keywords.forEach((kw) => {
    videoConditions.push(
      { title: { $regex: kw, $options: "i" } },
      { description: { $regex: kw, $options: "i" } },
      { tags: { $regex: kw, $options: "i" } }
    );

    shortConditions.push(
      { title: { $regex: kw, $options: "i" } },
      { tags: { $regex: kw, $options: "i" } }
    );

    channelConditions.push(
      { title: { $regex: kw, $options: "i" } },
      { category: { $regex: kw, $options: "i" } },
      { description: { $regex: kw, $options: "i" } }
    );
  });

  //find videos
  const videos = await Video.find({$or: videoConditions}).populate("channel comments.author comments.replies.author")

  //find shorts
  const shorts = await Short.find({$or: shortConditions}).populate("channel", "name avatar")
  .populate("likes", "username avatar")

  //find channels

  const channels = await Channel.find({$or: channelConditions})
  .populate("owner", "username avatar")
  .populate("subscribers", "username avatar")
  .populate({
    path: "videos",
    populate: {path: "channel", select: "name avatar"}
  })
  .populate({
     path: "shorts",
    populate: {path: "channel", select: "name avatar"}
  })

  return res.status(200).json(
    new ApiResponse(200, {
      videos, shorts, channels,keywords
    })
  )

});

export { searchWithAi, filterCategoyWithAi };
