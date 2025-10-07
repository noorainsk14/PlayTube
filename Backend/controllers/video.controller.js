import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/User.model.js";
import {Video} from "../models/Video.model.js"
import { Channel } from "../models/Channel.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const createVideo = asyncHandler(async(req, res) => {
  const {title, description, channelId , tags} = req.body

 if (!title || !req.files?.video || !req.files?.thumbnail || !channelId) {
  throw new ApiError(400, "title, video, thumbnail, and channelId are required");
}

  const channelData = await Channel.findById(channelId)

  if(!channelData){
    throw new ApiError(400, "Channel not found !!")
  }

  const uploadVideo = await uploadOnCloudinary(req.files.video[0].path)
  const  video = uploadVideo?.secure_url

  const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path)
  const thumbnail = uploadThumbnail?.secure_url

  let parsedTag = []
  if(tags){
    try {
      parsedTag = JSON.parse(tags)
    } catch (error) {
      parsedTag=[]
      
    }
  }

  const newVideo = await Video.create({
    title,
    channel:channelData._id,
    description,
    videoUrl: video,
    thumbnail: thumbnail,
    tags: parsedTag 

  })

  await Channel.findByIdAndUpdate(channelData._id, 
    {$push : {videos : newVideo._id}},
    {new: true}
  )

  return res.status(201).json( new ApiResponse(201, {newVideo}, "Video uploaded successfully" ))


})

const getAllVideos = asyncHandler(async(req, res) => {
  const videos = await Video.find().sort({createdAt: -1}).populate('channel')

  if(!videos) {
    throw new ApiError(400, "Videos are not found !!")
  }

  return res.status(200).json( new ApiResponse(200, {videos}, "Videos fetch successfully !!"))
})

export {createVideo, getAllVideos}