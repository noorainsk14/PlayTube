import mongoose, { Schema, model } from "mongoose";

const channelSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Channel name is required"],
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    shorts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Short",
      },
    ],
    playlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
    communityPost: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

channelSchema.pre("save", function (next) {
  this.name = this.name.trim();
  next();
});

export const Channel = model("Channel", channelSchema);
