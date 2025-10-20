import axios from "axios";
import React, { useState } from "react";
import { FaComment, FaHeart, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";
import { showSuccessToast } from "../helper/toastHelper";

const PostCard = ({ post }) => {
  const { userData } = useSelector((state) => state.user);
  const [liked, setLiked] = useState(
    post.likes?.some((u) => u.toString() === userData?._id?.toString()) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  //console.log(post);

  const handleLike = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/post/toggle-like`,
        { postId: post?._id },
        { withCredentials: true }
      );
      //console.log(result.data?.data?.post?.likes);
      setLikeCount(result.data?.data?.post?.likes.length);
      setLiked(result.data?.data?.post?.likes.includes(userData?._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) {
      return;
    }
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/post/add-comment`,
        { message: newComment, postId: post?._id },
        { withCredentials: true }
      );

      //console.log(result.data?.data?.post?.comments);
      setComments((prev) => [
        result.data?.data?.post?.comments?.slice(-1)[0],
        ...prev,
      ]);
      showSuccessToast("Comment sent !");
      setNewComment("");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const handleAddReply = async ({ replyText, commentId }) => {
    if (!replyText) {
      return;
    }
    setLoading1(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/post/add-reply`,
        { message: replyText, postId: post?._id, commentId },
        { withCredentials: true }
      );

      //console.log(result.data?.data?.populatedPost?.comments);
      setComments(result.data?.data?.populatedPost?.comments);
      showSuccessToast("Reply sent !");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading1(false);
      }, 800);
    }
  };

  return (
    <div className="w-100 min-h-80 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded p-5 shadow-lg border border-gray-700 mb-[50px] relative flex flex-col justify-between">
      <div>
        <p className="text-base text-gray-200">{post.content}</p>
        {post?.image && (
          <img
            src={post?.image}
            className="w-90 h-80 object-cover rounded-xl mt-4 shadow-lg"
          />
        )}
      </div>
      <div className="flex justify-between items-center mt-4 text-gray-400 text-sm pt-4 border-t border-gray-800">
        <span className="italic text-gray-500">
          {new Date(post?.createdAt).toDateString()}
        </span>
        <div className="flex gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 cursor-pointer transition ${
              liked ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            <FaHeart />
            {likeCount}
          </button>
          <button
            className="flex items-center gap-2 hover:text-orange-400 cursor-pointer transition"
            onClick={() => {
              setShowComments(true);
            }}
          >
            <FaComment />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-2xl border-t border-gray-700 max-h-[300px] overflow-y-auto space-y-3">
          <div className="flex items-center w-full justify-between py-[10px]">
            <h3 className="text-gray-300 font-semibold mb-2">Comments</h3>
            <button
              className="text-gray-400 hover:text-orange-500 transition "
              onClick={() => {
                setShowComments(false);
              }}
            >
              <FaTimes size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-3 items-center ">
            <img
              src={userData?.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />

            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-700  text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-200"
              placeholder="Add a comment..."
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
              value={newComment}
            />
            <button
              disabled={loading}
              onClick={handleAddComment}
              className="px-4 py-2 bg-orange-600 rounded-lg text-white text-sm hover:bg-orange-700"
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Post"
              )}
            </button>
          </div>

          <div className="space-y-3 ">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment?._id} className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={comment?.author?.avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm font-semibold text-gray-200">
                      {comment?.author?.username}
                    </span>
                  </div>
                  <p className="text-gray-200 ml-8">{comment?.message}</p>
                  <div className="ml-4 mt-2 space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {comment?.replies?.map((reply) => (
                      <div
                        key={reply._id}
                        className="p-2 bg-[#2a2a2a] rounded "
                      >
                        <div className="flex items-center justify-start gap-1 pb-2">
                          <img
                            src={reply?.author?.avatar}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <h2 className="text-[14pxpx]">
                            @{reply?.author?.username}
                          </h2>
                        </div>
                        <p className="pt-3 pl-6  ">{reply?.message}</p>
                      </div>
                    ))}
                  </div>

                  <ReplyComment
                    comment={comment}
                    handleReply={handleAddReply}
                    loading1={loading1}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ReplyComment = ({ comment, handleReply, loading1 }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  return (
    <div className="mt-3 w-full px-4">
      {showReplyInput && (
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 pl-5 pr-4">
          <input
            onChange={(e) => {
              setReplyText(e.target.value);
            }}
            type="text"
            placeholder="Add a reply"
            name="reply"
            id="reply"
            className="flex-1  mb-4 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600 "
          />
          <button
            disabled={loading1}
            className="bg-orange-600 mb-4 cursor-pointer hover:bg-orange-700 text-white px-4 py-2 rounded-lg whitespace-nowrap "
            onClick={() => {
              handleReply({ commentId: comment._id, replyText: replyText });
              setTimeout(() => {
                setShowReplyInput(false);
              }, 1000);

              setReplyText("");
            }}
          >
            {loading1 ? (
              <span className="loading loading-spinner loading-md text-white"></span>
            ) : (
              "Reply"
            )}
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setShowReplyInput(!showReplyInput);
        }}
        className="ml-4 pt-0 text-gray-400  hover:bg-gray-400  hover:text-black rounded-xl w-10  cursor-pointer hover:underline"
      >
        reply
      </button>
    </div>
  );
};

export default PostCard;
