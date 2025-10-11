import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
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
  FaComment,
  FaArrowDown,
} from "react-icons/fa";
import Description from "../../components/Description";
import IconButton from "../../components/IconButton";
import { serverUrl } from "../../App.jsx";
import axios from "axios";

const Shorts = () => {
  const { shortData } = useSelector((state) => state.content);
  const { userData } = useSelector((state) => state.user);

  const [shortList, setShortList] = useState([]);
  const shortRef = useRef([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewedShort, setViewedShort] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = shortRef.current[index];

          if (video) {
            if (entry.isIntersecting) {
              (video.muted = false), video.play();
              const currentShortId = shortList[index]._id;
              if (!viewedShort.includes(currentShortId)) {
                handleAddView(currentShortId);
                setViewedShort((prev) => [...prev, currentShortId]);
              }
            } else {
              video.muted = true;
              video.pause();
            }
          }
        });
      },
      { threshold: 0.7 }
    );

    shortRef.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }

      return () => observer.disconnect();
    });
  }, [shortList]);

  const togglePlay = (index) => {
    const video = shortRef.current[index];

    if (video) {
      if (video.paused) {
        video.play();
        setPlayIndex(null);
      } else {
        video.pause();
        setPlayIndex(index);
      }
    }
  };

  const handlSsubscribe = async (channelId) => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/channel/toggle-subscribe`,
        { channelId },
        { withCredentials: true }
      );
      console.log(result.data);
      const updatedChannel = result.data?.data?.updatedChannel;
      setShortList((prev) =>
        prev.map((short) =>
          short?.channel?._id === channelId
            ? { ...short, channel: updatedChannel }
            : short
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 700);
    }
  };

  const toggleLike = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/v1/short/${shortId}/toggle-like`,
        {},
        { withCredentials: true }
      );
      console.log(result.data?.data?.short);
      const updatedShort = result.data?.data?.short;
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === updatedShort._id ? updatedShort : short
        )
      );
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const toggleDisLike = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/v1/short/${shortId}/toggle-dislike`,
        {},
        { withCredentials: true }
      );
      console.log(result.data?.data?.short);
      const updatedShort = result.data?.data?.short;
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === updatedShort._id ? updatedShort : short
        )
      );
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const toggleSave = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/v1/short/${shortId}/toggle-save`,
        {},
        { withCredentials: true }
      );
      console.log(result.data?.data?.short);
      const updatedShort = result.data?.data?.short;
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === updatedShort._id ? updatedShort : short
        )
      );
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const handleAddView = async (shortId) => {
    try {
      await axios.put(
        `${serverUrl}/api/v1/short/${shortId}/add-view`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!shortData || shortData.length === 0) {
      return;
    }

    const shuffled = [...shortData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);
    //console.log(shuffled);
  }, [shortData]);

  return (
    <div className="h-[100vh] w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList?.map((short, index) => (
        <div
          key={short?.id}
          className="min-h-screen w-full flex md:items-center items-start justify-center snap-start pt-[40px] md:pt-0"
        >
          <div
            className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl  border border-gray-700 cursor-pointer"
            onClick={() => {
              togglePlay(index);
            }}
          >
            <video
              autoPlay
              src={short?.shortUrl}
              ref={(el) => (shortRef.current[index] = el)}
              data-index={index}
              className="w-full h-full object-cover"
              loop
              playsInline
            />
            {playIndex === index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPlay className="text-white text-lg" />
              </div>
            )}
            {playIndex !== index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPause className="text-white text-lg" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-1">
              <div className="flex items-center justify-start gap-2">
                <img
                  src={short?.channel?.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-1 border-gray-700 "
                />
                <span className="text-sm text-gray-300">
                  @{short?.channel?.name?.toLowerCase()}
                </span>
                <button
                  style={{ minWidth: "80px" }}
                  className={`
                    ${
                      short?.channel?.subscribers?.includes(userData?._id)
                        ? "bg-[#000000a1] text-white border-1 border-gray-700"
                        : "bg-white text-black"
                    }
                   text-xs px-[10px] py-[10px] rounded-full cursor-pointer`}
                  onClick={() => {
                    handlSsubscribe(short?.channel?._id);
                  }}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : short?.channel?.subscribers?.includes(userData?._id) ? (
                    "Subscribed"
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
              <div className="flex items-center justify-start">
                <h3 className="font-bold text-lg line-clamp-2">
                  {short?.title}
                </h3>
              </div>
              <div>
                {short?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <Description text={short?.description} />
              </div>

              <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 text-white">
                <IconButton
                  icon={FaThumbsUp}
                  label={"Likes"}
                  active={short?.likes?.includes(userData._id)}
                  count={short?.likes?.length}
                  onClick={() => {
                    toggleLike(short?._id);
                  }}
                />
                <IconButton
                  icon={FaThumbsDown}
                  label={"Dislikes"}
                  active={short?.disLikes?.includes(userData._id)}
                  count={short?.disLikes?.length}
                  onClick={() => {
                    toggleDisLike(short?._id);
                  }}
                />
                <IconButton
                  icon={FaComment}
                  label={"Comment"}
                  onClick={() => {
                    setOpenComment(!openComment);
                  }}
                />
                <IconButton
                  icon={FaDownload}
                  label={"Download"}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = short?.shortUrl;
                    link.download = `${short?.title}.mp4`;
                    link.click();
                  }}
                />

                <IconButton
                  icon={FaBookmark}
                  label={"Save"}
                  active={short?.savedBy?.includes(userData._id)}
                  onClick={() => {
                    toggleSave(short?._id);
                  }}
                />
              </div>
            </div>
            {openComment && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/90 text-white p-4 rounded-t-2xl overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comments</h3>
                  <button>
                    <FaArrowDown
                      size={20}
                      onClick={() => {
                        setOpenComment(!openComment);
                      }}
                    />
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a Comments..."
                    className="flex-1 bg-gray-900 text-white p-2 rounded"
                  />
                  <button className="bg-black px-4 py-2 border-1 border-gray-700 rounded-xl">
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shorts;
