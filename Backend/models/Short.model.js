import mongoose, { Schema, model, Types } from "mongoose";

const replySchema = new Schema({
author:{
        type:Types.ObjectId,
        ref: "User"
    },
    message:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date
    }
},{_id:true})

const commentSchema = new Schema({
    author:{
        type:Types.ObjectId,
        ref: "User"
    },
    message:{
        type:String,
        required:true
    },
    replies:{replySchema},
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date
    }
},{_id:true})

const shortSchema = new Schema({
    channel:{
        type:Types.ObjectId,
        ref:"Channel",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    shortUrl:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default: []
    },
    views:{
        type:Number,
        default:0
    },
    likes:[{
        type:Types.ObjectId,
        ref:"User",
    }],
    disLikes:[{
        type:Types.ObjectId,
        ref:"User",
    }],
    savedBy:[{
            type:Types.ObjectId,
            ref:"User",
        }],
    comments:{commentSchema}


}, {timestamps:true})

export const Short = model("Short", shortSchema)
