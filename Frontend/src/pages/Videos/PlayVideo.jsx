import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SiYoutubeshorts } from "react-icons/si";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaThumbsUp,
  FaThumbsDown,
  FaDownload,
  FaBookmark,
} from "react-icons/fa";
import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";
import IconButton from "../../components/IconButton";
import Description from "../../components/Description";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";
import axios from "axios";
import { showSuccessToast } from "../../helper/toastHelper";
import { setVideoData } from "../../redux/contentSlice";

const PlayVideo = () => {
  const videoRef = useRef();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const { videoData, shortData } = useSelector((state) => state.content);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { channelData } = useSelector((state) => state.user);
  const suggestVideo =
    videoData?.filter((v) => v._id !== videoId).slice(0, 10) || [];
  const suggestShort = shortData?.slice(0, 10) || [];
  const dispatch = useDispatch();
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const hasViewed = useRef(false);

  // useEffect(() => {
  //   if (!videoData) {
  //     return;
  //   }
  //   const currentVideo = videoData.find((v) => v._id.toString() === videoId);

  //   if (currentVideo) {
  //     setVideo(currentVideo);

  //     setChannel(currentVideo.channel);
  //     setComment(currentVideo.comments);
  //   }

  //   const addViews = async () => {
  //     if (hasViewed.current) return;
  //     try {
  //       const result = await axios.put(
  //         `${serverUrl}/api/v1/video/${videoId}/add-view`,
  //         {},
  //         { withCredentials: true }
  //       );
  //       setVideo((prev) =>
  //         prev ? { ...prev, views: result.data.data.video.views } : prev
  //       );
  //       const updatedVideo = result.data.data.video;

  //       // 🔁 Replace the old video in the videoData array
  //       const updatedVideoData = videoData.map((v) =>
  //         v._id === videoId ? updatedVideo : v
  //       );

  //       dispatch(setVideoData(updatedVideoData));
  //       hasViewed.current = true;
  //     } catch (error) {
  //       console.log(error.response.data.message);
  //     }
  //   };

  //   addViews();
  // }, [videoId, videoData]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/v1/video/${videoId}`, {
          withCredentials: true,
        });

        const fullVideo = res.data.data.video;

        setVideo(fullVideo);
        setChannel(fullVideo.channel);
        setComment(fullVideo.comments);

        // Optional: update Redux with latest video data
        const updatedVideoData = videoData?.map((v) =>
          v._id === fullVideo._id ? fullVideo : v
        );
        if (updatedVideoData) {
          dispatch(setVideoData(updatedVideoData));
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleUpdateTime = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;

    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const togglePlay = () => {
    // console.log(videoRef.current);
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };
  const skipBackward = () => {
    if (!videoRef.current) return;
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVol(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    }
  };

  const handleSubscribe = async () => {
    if (!channel || !channel._id) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/v1/channel/toggle-subscribe`,
        { channelId: channel._id },
        { withCredentials: true }
      );

      const updatedChannel = response.data.data.updatedChannel;

      const subscribed = updatedChannel.subscribers.some(
        (sub) =>
          sub?._id?.toString() === userData._id.toString() ||
          sub?.toString() === userData._id.toString()
      );

      showSuccessToast(
        subscribed ? "Subscription added" : "Subscription removed"
      );

      setChannel(updatedChannel);
      dispatch(setChannelData(updatedChannel));
    } catch (error) {
      console.error("Subscription error:", error);
      showErrorToast(
        error?.response?.data?.message ||
          error.message ||
          "Subscription error !!"
      );
    } finally {
      // Add 800ms delay before setting loading to false
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const toggleLiked = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/v1/video/${videoId}/toggle-like`,
        {},
        { withCredentials: true }
      );
      console.log(result.data.data.video);
      setVideo(result.data.data.video);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const toggleDisLiked = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/v1/video/${videoId}/toggle-dislike`,
        {},
        { withCredentials: true }
      );
      console.log(result.data.data.video);
      setVideo(result.data.data.video);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const toggleSave = async () => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/v1/video/${videoId}/toggle-save`,
        {},
        { withCredentials: true }
      );
      setVideo(result.data.data.video);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) {
      return;
    }
    setLoading1(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/video/${videoId}/add-comment`,
        { message: newComment },
        { withCredentials: true }
      );
      console.log(result.data?.data?.video?.comments);
      setComment((prev) => [
        result.data?.data?.video?.comments.slice(-1)[0],
        ...prev,
      ]);
      setNewComment("");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading1(false);
      }, 800);
    }
  };

  const handleReply = async ({ commentId, replyText }) => {
    setLoading2(true);
    if (!replyText) {
      setLoading2(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/video/${videoId}/${commentId}/add-reply`,
        { message: replyText },
        { withCredentials: true }
      );
      console.log(result.data?.data?.populatedVideo?.comments);
      const updatedComments = result.data?.data?.populatedVideo?.comments;
      setComment(updatedComments);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading2(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (channel?.subscribers && userData?._id) {
      setIsSubscribe(
        channel.subscribers.some(
          (sub) =>
            sub?._id?.toString() === userData._id.toString() ||
            sub?.toString() === userData._id.toString()
        )
      );
    }
  }, [channel?.subscribers, userData?._id]);

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1">
        {/* video player */}
        <div
          onMouseEnter={() => {
            setShowControls(true);
          }}
          onMouseLeave={() => {
            setShowControls(false);
          }}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
        >
          <video
            src={video?.videoUrl}
            className="w-full h-full object-contain"
            controls={false}
            autoPlay
            ref={videoRef}
            onPlay={() => {
              setIsPlaying(true);
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
            onTimeUpdate={handleUpdateTime}
          />
          {showControls && (
            <div className="absolute  inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
              <button
                className="bg-black/70 p-3 cursor-pointer  sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={skipBackward}
              >
                <FaBackward size={24} />
              </button>
              <button
                className="bg-black/70 p-3 cursor-pointer sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={togglePlay}
              >
                {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 cursor-pointer rounded-full hover:bg-orange-600 transition"
                onClick={skipForward}
              >
                <FaForward size={24} />
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0  bg-gradient-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30">
            <input
              type="range"
              min={0}
              max={100}
              className="w-full cursor-pointer accent-orange-600"
              onChange={handleSeek}
              value={progress}
            />

            <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-xm text-gray">
              <div className="flex items-center gap-3">
                <span>
                  {formatTime(currentTime)}/ {formatTime(duration)}
                </span>
                <button
                  className="bg-black/70 px-2 py-1  cursor-pointer rounded hover:bg-orange-600 transition"
                  onClick={skipBackward}
                >
                  <FaBackward size={15} />
                </button>
                <button
                  className="bg-black/70 px-2 py-1 cursor-pointer rounded hover:bg-orange-600 transition"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FaPause size={14} /> : <FaPlay size={15} />}
                </button>
                <button
                  className="bg-black/70 px-2 py-1 cursor-pointer rounded hover:bg-orange-600 transition"
                  onClick={skipForward}
                >
                  <FaForward size={15} />
                </button>
              </div>
              <div className="flex text-xl items-center gap-2  sm:gap-2">
                <button className="cursor-pointer p-2" onClick={handleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  name="volume"
                  id="volume"
                  value={isMuted ? 0 : vol}
                  onChange={handleVolume}
                  className="accent-orange-600 cursor-pointer w-16 sm:w-24"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <button onClick={handleFullScreen} className="cursor-pointer">
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>

        <h1 className="mt-4 text-lg sm:text-xl font-bold text-white flex ">
          {video?.title}
        </h1>
        <p className="text-sm text-gray-400">{video?.views} views</p>
        <div className="flex mt-2 flex-wrap items-center justify-between">
          <div className="flex  items-center justify-start gap-4 cursor-pointer">
            <img
              onClick={() => {
                navigate(`/channel-page/${channel?._id}`);
              }}
              src={channel?.avatar}
              alt={channel?.avatar}
              className="w-12 h-12 rounded-full border-2 border-gray-600"
            />
            <div>
              <h1
                className="text-md font-bold cursor-pointer"
                onClick={() => {
                  navigate(`/channel-page/${channel?._id}`);
                }}
              >
                {channel?.name}
              </h1>
              <h3 className="text-[13px]">{channel?.subscribers?.length}</h3>
            </div>
            <button
              style={{ minWidth: "120px" }}
              onClick={handleSubscribe}
              className={`px-[20px] py-[8px] rounded-4xl border cursor-pointer border-gray-600 ml-[20px] text-md ${
                isSubscribe
                  ? "bg-black text-white  hover:bg-orange-600 hover:text-black "
                  : "bg-white text-black  hover:bg-orange-600 hover:text-black"
              }`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : isSubscribe ? (
                "Subscribed"
              ) : (
                "Subscribe"
              )}
            </button>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <IconButton
              icon={FaThumbsUp}
              label={"Likes"}
              active={video?.likes?.includes(userData._id)}
              count={video?.likes?.length}
              onClick={toggleLiked}
            />
            <IconButton
              icon={FaThumbsDown}
              label={"Dislikes"}
              active={video?.disLikes?.includes(userData._id)}
              count={video?.disLikes?.length}
              onClick={toggleDisLiked}
            />
            <IconButton
              icon={FaDownload}
              label={"Download"}
              onClick={() => {
                const link = document.createElement("a");
                link.href = video?.videoUrl;
                link.download = `${video?.title}.mp4`;
                link.click();
              }}
            />
            <IconButton
              icon={FaBookmark}
              label={"Save"}
              active={video?.savedBy?.includes(userData._id)}
              onClick={toggleSave}
            />
          </div>
        </div>
        <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
          <h2 className="text-md font-semibold mb-2">Description</h2>
          <Description text={video?.description} />
        </div>
        <div className="mt-2">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-600"
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
              value={newComment}
            />
            <button
              disabled={loading1}
              onClick={handleAddComment}
              className="bg-orange-600 cursor-pointer hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
            >
              {loading1 ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Post"
              )}
            </button>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {comment.map((comment) => (
              <div
                key={comment._id}
                className="p-3 bg-[#1a1a1a] rounded-lg shadow-sm text-sm"
              >
                <div className="flex items-start justify-start gap-3">
                  <img
                    className="w-8 h-8 mt-8 ml-4  rounded-full object-cover"
                    src={comment?.author?.avatar}
                    alt="avatar"
                  />
                  <div className="flex flex-col w-full">
                    <h2 className="text-lg font-semibold pl-1 pt-4 mt-4">
                      @{comment?.author?.username}
                    </h2>
                    <p className="font-lg px-[20px] py-[20px] pb-0 pl-8">
                      {comment?.message}
                    </p>

                    <ReplyComment
                      loading2={loading2}
                      comment={comment}
                      handleReply={handleReply}
                    />

                    <div className="ml-4 mt-2 space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {comment?.replies.map((reply) => (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[380px] px-4 py-4 border-t lg:border-t-0 lg:border-1 border-gray-800 overflow-y-auto">
        <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
          <SiYoutubeshorts className="text-orange-600" />
          Shorts
        </h2>
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3">
          {/* {console.log("suggestShort:", suggestShort)} */}
          {suggestShort?.map((short) => (
            <div key={short._id}>
              <ShortCard
                shortUrl={short?.shortUrl}
                title={short?.title}
                channelName={short?.channel?.name}
                avatar={short?.channel?.avatar}
                id={short?._id}
                views={short?.views}
              />
            </div>
          ))}
        </div>
        <div className="font-bold text-lg mt-4 mb-3">Up Next</div>
        <div className="space-y-3">
          {suggestVideo?.map((v) => (
            <div
              key={v._id}
              className="flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition"
              onClick={() => {
                navigate(`/play-video/${v._id}`);
              }}
            >
              <img
                src={v?.thumbnail}
                className="w-12 sm:w-40 h-20 sm:h-24 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold line-clamp-2 text-sm sm:text-base text-white ">
                  {v?.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {v?.channel?.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {v?.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ReplyComment = ({ comment, handleReply, loading2 }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  return (
    <div className="mt-3 w-full px-4">
      {showReplyInput && (
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 pl-20 pr-4">
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
            className="bg-orange-600 mb-4 cursor-pointer hover:bg-orange-700 text-white px-4 py-2 rounded-lg whitespace-nowrap "
            onClick={() => {
              handleReply({ commentId: comment._id, replyText: replyText });
              setTimeout(() => {
                setShowReplyInput(false);
              }, 1000);

              setReplyText("");
            }}
          >
            {loading2 ? (
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
export default PlayVideo;
