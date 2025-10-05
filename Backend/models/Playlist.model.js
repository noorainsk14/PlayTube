import mongoose, { Schema, model, Types } from "mongoose";



const playlistSchema = new Schema({
    channel:{
        type:Types.ObjectId,
        ref:"Channel",
        required:true
    },title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    savedBy:[{
            type:Types.ObjectId,
            ref:"User",
        }],


}, {timestamps:true})

export const Playlist = model("Playlist", playlistSchema)
