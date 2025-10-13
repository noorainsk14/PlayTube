import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Channel } from "../models/Channel.model.js";
import { Video } from "../models/Video.model.js";
import { Playlist } from "../models/Playlist.model.js";
import { Post } from "../models/Post.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";


const createPost = asyncHandler(async(req, res) => {
    const {ChannelId, content} = req.body
    const file = req.file

    if(!ChannelId || !content){
        throw new ApiError(400, "ChannelId and content are required")
    }

    let imageUrl = null

    if(file){
        imageUrl = await uploadOnCloudinary(file.path)
        imageUrl = imageUrl.secure_url

    }

    const post = await Post.create({
        channel:ChannelId,
        content,
        image:imageUrl

    })

    await Channel.findByIdAndUpdate(ChannelId, {
        $push:{communityPost: post._id}
    })



    return res.status(201).json(
        new ApiResponse(201, {post}, "Post created Successfull !")
    )
})

const getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).populate("channel comments.author comments.replies.author");

  if (!posts) {
    throw new ApiError(400, "Posts are not found !!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { posts }, "Posts fetch successfully !!"));
});

const toggleLike = asyncHandler(async (req, res) => {
  const { postId } = req.body;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Invalid postId");
  }

  const post = await Post.findById(postId).populate("channel");

  if (!post) {
    throw new ApiError(404, "post not found !!");
  }

  let isLiked = false;

  if (post.likes.includes(userId)) {
    post.likes.pull(userId);
    isLiked = false;
  } else {
    post.likes.push(userId);
    isLiked = true;
    
  }

  await post.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { post },
        isLiked ? "Post Liked !!" : "Like removed !!"
      )
    );
});

const addComment = asyncHandler(async(req, res) => {
  const {postId} = req.body;
  const {message} = req.body;
  const userId = req.user?._id

  const post = await Post.findById(postId)
  if(!post){
    throw new ApiError(400, "post not found !")
  }

  post?.comments.push({
    author: userId,
    message
  })

 await post.save();

  const populatedPost = await Post.findById(postId).populate({path: "comments.author", select : "username avatar email"}).populate({path: "comments.replies.author", select: "username avatar email"})
  

  return res.status(201).json(
     new ApiResponse(201, { post: populatedPost }, "Comment added !!")
  )
})

const addReply = asyncHandler(async(req, res) => {
  const {postId, commentId} = req.body;
  const {message} = req.body;
  const userId = req.user?._id

  const post = await Post.findById(postId)
  if(!post){
    throw new ApiError(400, "Post not found !")
  }

  const comment = await  post.comments.id(commentId)
  console.log("comment =",comment)
  if(!comment){
    throw new ApiError(404, "Comment not found !")
  }

  comment.replies.push({author:userId, message})

  await post.save()

  const populatedPost = await Post.findById(postId).populate({path: "comments.author", select : "username avatar email"}).populate({path: "comments.replies.author", select: "username avatar email"})

  return res
  .status(201)
  .json(
    new ApiResponse(201,{populatedPost},"Reply added !!")
  )



})

export {
    createPost,
    getAllPost,
    toggleLike,
    addComment,
    addReply
}