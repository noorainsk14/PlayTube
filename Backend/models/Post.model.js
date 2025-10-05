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

const postSchema = new Schema({
    channel:{
        type:Types.ObjectId,
        ref:"Channel",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    likes:[{
        type:Types.ObjectId,
        ref:"User",
    }],
    comments:{commentSchema}


}, {timestamps:true})

export const Post = model("Post", postSchema)
