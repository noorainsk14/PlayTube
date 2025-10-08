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
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { channelData } = useSelector((state) => state.user);
  const suggestVideo =
    videoData?.filter((v) => v._id !== videoId).slice(0, 10) || [];
  const suggestShort = shortData?.slice(0, 10) || [];
  const dispatch = useDispatch();
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasViewed = useRef(false);

  useEffect(() => {
    if (!videoData) {
      return;
    }
    const currentVideo = videoData?.find((v) => v._id === videoId);

    if (currentVideo) {
      setVideo(currentVideo);
      setChannel(currentVideo.channel);
    }

    const addViews = async () => {
      if (hasViewed.current) return;
      try {
        const result = await axios.put(
          `${serverUrl}/api/v1/video/${videoId}/add-view`,
          {},
          { withCredentials: true }
        );
        console.log(result.data.data.video);
        setVideo((prev) =>
          prev ? { ...prev, views: result.data.data.video.views } : prev
        );
        const updatedVideo = result.data.data.video;

        // 🔁 Replace the old video in the videoData array
        const updatedVideoData = videoData.map((v) =>
          v._id === videoId ? updatedVideo : v
        );

        dispatch(setVideoData(updatedVideoData));
        hasViewed.current = true;
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    addViews();
  }, [videoId, videoData]);

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
      await Promise.all([
        axios.post(
          `${serverUrl}/api/v1/channel/toggle-subscribe`,
          { channelId: channel._id },
          { withCredentials: true }
        ),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]).then(([result]) => {
        const updatedChannel = result.data.data.updatedChannel;

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
      });
    } catch (error) {
      console.error("Subscription error:", error);
      showErrorToast(
        error?.response?.data?.message ||
          error.message ||
          "Subscription error !!"
      );
    } finally {
      setLoading(false);
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
            <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={skipBackward}
              >
                <FaBackward size={24} />
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={togglePlay}
              >
                {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-orange-600 transition"
                onClick={skipForward}
              >
                <FaForward size={24} />
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30">
            <input
              type="range"
              min={0}
              max={100}
              className="w-full accent-orange-600"
              onChange={handleSeek}
              value={progress}
            />

            <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-xm text-gray">
              <div className="flex items-center gap-3">
                <span>
                  {formatTime(currentTime)}/ {formatTime(duration)}
                </span>
                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={skipBackward}
                >
                  <FaBackward size={14} />
                </button>
                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={togglePlay}
                >
                  {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                </button>
                <button
                  className="bg-black/70 px-2 py-1 rounded hover:bg-orange-600 transition"
                  onClick={skipForward}
                >
                  <FaForward size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-2">
                <button onClick={handleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  name="volume"
                  id="volume"
                  value={isMuted ? 0 : vol}
                  onChange={handleVolume}
                  className="accent-orange-600 w-16 sm:w-24"
                  min={0}
                  max={1}
                  step={0.1}
                />
                <button onClick={handleFullScreen}>
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
          <div className="flex  items-center justify-start gap-4">
            <img
              src={channel?.avatar}
              alt={channel?.avatar}
              className="w-12 h-12 rounded-full border-2 border-gray-600"
            />
            <div>
              <h1 className="text-md font-bold">{channel?.name}</h1>
              <h3 className="text-[13px]">{channel?.subscribers?.length}</h3>
            </div>
            <button
              onClick={handleSubscribe}
              className={`px-[20px] py-[8px] rounded-4xl border border-gray-600 ml-[20px] text-md ${
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
              count={video?.likes.length}
            />
            <IconButton
              icon={FaThumbsDown}
              label={"Dislikes"}
              active={video?.dislike?.includes(userData._id)}
              count={video?.dislike?.length}
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
              active={video?.saveBy?.includes(userData._id)}
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
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
              Post
            </button>
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

export default PlayVideo;
