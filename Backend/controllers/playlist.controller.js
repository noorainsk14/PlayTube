import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Channel } from "../models/Channel.model.js";
import { Video } from "../models/Video.model.js";
import { Playlist } from "../models/Playlist.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async(req, res) => {
    const {title, description, channelId, videoIds} = req.body

    if(!title || !channelId){
        throw new ApiError(400, "title and channelId is required")
    }

    const channel = await Channel.findById(channelId)

    if(!channel){
        throw new ApiError(400, "Channel is not found.")
    }

    const videos = await Video.find({
        _id : { $in : videoIds},
        channel:channelId
    })

    if(videos.length !== videoIds.length){
         throw new ApiError(400, "Some videos are found.")
    }

    const playlist = await Playlist.create({
        title,
        description,
        channel:channelId,
        videos:videoIds
    })

    await Channel.findByIdAndUpdate(channelId, {
        $push :{playlist: playlist._id}
    })

    return res.status(201).json(
        new ApiResponse(201, {playlist}, "Playlist created.")
    )


})

const toggleSavePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    throw new ApiError(400, "Invalid playlistId");
  }

  const playlist = await Playlist.findById(playlistId).populate("channel");

  if (!playlist) {
    throw new ApiError(404, "playlist not found !!");
  }

  let isSaved = false;

  if (playlist.savedBy.includes(userId)) {
    playlist.savedBy.pull(userId);
    isSaved = false;
  } else {
    playlist.savedBy.push(userId);
    isSaved = true;
  }

  await playlist.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist },
        isSaved ? "Playlist saved !!" : "Failed to save plalist !!"
      )
    );
});

const getSavedPlaylist = asyncHandler(async(req, res) => {
  const userId = req.user?._id

   if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }


  const savedPlaylist = await Playlist.find({savedBy : userId}).populate("videos").populate({
    path: "videos",
    populate: {path: "channel"}
  })

  if(!savedPlaylist){
    throw new ApiError(404, "No videos liked.")
  }

  return res.status(200).json(
    new ApiResponse(200, {savedPlaylist}, "Saved Videos")
  )
})

const fetchPlaylist = asyncHandler(async(req, res) => {
  const {playlistId} = req.params;
  const playlist = await Playlist.findById(playlistId).populate("channel", "name avatar").populate(
    {
      path:"videos",
      populate: {path: "channel", select : "name avatar"}
    }
  )

  if(!playlist){
    throw new ApiError(404, "Playlist not found")
  }

  return res.status(200).json(
    new ApiResponse(200, {playlist}, "Playlist fetched !")
  )
})

const updatePlaylist = asyncHandler(async(req, res) => {
  const {playlistId} = req.params;
  const {title, description, addVideos = [], removeVideos =[] } = req.body;

  const playlist = await Playlist.findById(playlistId)
  if(!playlist){
    throw new ApiError(404, "Playlist not found.")
  }

  if(title){
    playlist.title = title
  }

  if(description){
    playlist.description= description
  }
  //add videos avoid duplicates
  playlist.videos.push(...addVideos);
  playlist.videos = [...new Set(playlist.videos.map(v => v.toString()))]

  //remove videos
  playlist.videos = playlist.videos.filter(
    vid => !removeVideos.includes(vid.toString())
  )

  await playlist.save();
 
  return res.status(200).json(
    new ApiResponse(200, {playlist}, "PLaylist updated successfully!")
  )

})

const deletePlaylist= asyncHandler(async(req, res) => {
  const {playlistId} = req.params;
  const playlist = await Playlist.findById(playlistId)
   if(!playlist){
    throw new ApiError(404, "playlist not found.")
  }

  await Channel.findByIdAndUpdate(playlist.channel, {
    $pull: {playlist: playlist._id},
  })

  await Playlist.findByIdAndDelete(playlistId)

  return res.status(200).json(
    new ApiResponse(200, {}, "PLaylist deleted successfully")
  )

})

export {
    createPlaylist,
    toggleSavePlaylist,
    getSavedPlaylist,
    fetchPlaylist,
    updatePlaylist,
    deletePlaylist
}