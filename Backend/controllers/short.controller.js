import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Short} from "../models/Short.model.js"
import { Channel } from "../models/Channel.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

const uploadShort = asyncHandler(async(req, res) => {
    const {title, description, channelId , tags} = req.body

    if(!title || !req.file || !channelId){
        throw new ApiError(400, "title and channelId is required !!")
    }

    const channelData = await Channel.findById(channelId)

    if(!channelData){
        throw new ApiError(404, "channel not found !!")
    }

    const uploadShort = await uploadOnCloudinary(req.file.path)

    
     const short = uploadShort.secure_url
    

    const newShort = await Short.create({
        channel: channelData._id,
        title: title,
        description,
        shortUrl: short,
        tags: tags ? JSON.parse(tags) : []

    })

    

    await Channel.findByIdAndUpdate(channelData._id, {
        $push: {shorts : newShort._id}
    }, {new: true})

    return res.status(201).json(new ApiResponse(201, newShort , "Short uploaded successfully !!"))


})

const getAllShorts = asyncHandler(async(req, res) => {
  const shorts = await Short.find().sort({createdAt: -1}).populate('channel')

  if(!shorts) {
    throw new ApiError(400, "Shorts are not found !!")
  }

  return res.status(200).json( new ApiResponse(200, {shorts}, "Shorts fetch successfully !!"))
})

export {
    uploadShort,
    getAllShorts
}