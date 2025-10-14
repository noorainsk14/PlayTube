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
import { useNavigate } from "react-router-dom";

const Shorts = () => {
  const { shortData } = useSelector((state) => state.content);
  const { userData } = useSelector((state) => state.user);

  const [shortList, setShortList] = useState([]);
  const shortRef = useRef([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [viewedShort, setViewedShort] = useState([]);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState({});
  const navigate = useNavigate();

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

  const handleAddComment = async (shortId) => {
    setLoading1(true);
    if (!newComment) {
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/short/${shortId}/add-comment`,
        { message: newComment },
        { withCredentials: true }
      );
      console.log(result.data?.data?.short?.comments);
      setComment((prev) => ({
        ...prev,
        [shortId]: result.data?.data?.short?.comments || [],
      }));
      setNewComment("");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading1(false);
      }, 800);
    }
  };

  const handleAddReply = async ({ commentId, replyText, shortId }) => {
    setLoading2(true);
    if (!replyText) {
      setLoading2(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/short/${shortId}/${commentId}/add-reply`,
        { message: replyText },
        { withCredentials: true }
      );
      console.log(result.data?.data?.short?.comments);

      setComment((prev) => ({
        ...prev,
        [shortId]: result.data?.data?.short?.comments || [],
      }));

      setReplyText((prev) => ({
        ...prev,
        [commentId]: "",
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading2(false);
      }, 1000);
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
          className="min-h-screen w-full flex md:items-center  items-start justify-center snap-start pt-[40px] md:pt-0"
        >
          <div
            className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl mt-[120px] md:mt-[0px] overflow-hidden shadow-xl  border border-gray-700 cursor-pointer"
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
                  onClick={() => {
                    navigate(`/channel-page/${short?.channel?._id}`);
                  }}
                  src={short?.channel?.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-1 border-gray-700 "
                />
                <span
                  onClick={() => {
                    navigate(`/channel-page/${short?.channel?._id}`);
                  }}
                  className="text-sm text-gray-300"
                >
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
                    setComment((prev) => ({
                      ...prev,
                      [short._id]: short.comments,
                    }));
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
                    onChange={(e) => {
                      setNewComment(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleAddComment(short?._id);
                    }}
                    className="bg-black px-4 py-2 border-1 border-gray-700 rounded-xl"
                  >
                    {loading1 ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      "Post"
                    )}
                  </button>
                </div>
                <div className="space-y-3 mt-4">
                  {comment[short?._id]?.length > 0 ? (
                    comment[short?._id].map((com) => (
                      <div
                        key={com._id}
                        className="bg-gray-800/40 p-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={com?.author?.avatar}
                            alt="avatar"
                            className="w-6 h-6 rounded-full"
                          />
                          <h3 className="text-sm font-semibold">
                            {com?.author?.username}
                          </h3>
                        </div>
                        <p className="text-sm ml-8">{com?.message}</p>
                        <button
                          className="text-md text-orange-500 mt-2  ml-8 hover:underline hover:text-orange-600 cursor-pointer"
                          onClick={() => {
                            setReply(!reply);
                          }}
                        >
                          reply
                        </button>

                        {reply && (
                          <div className="mt-2 ml-8 flex gap-2">
                            <input
                              onChange={(e) => {
                                setReplyText((prev) => ({
                                  ...prev,
                                  [com._id]: e.target.value,
                                }));
                              }}
                              value={replyText[com._id] || []}
                              type="text"
                              className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                              placeholder="Add a reply.."
                            />
                            <button
                              className="bg-orange-500 px-3 py-1 rounded-xl cursor-pointer  "
                              onClick={() => {
                                handleAddReply({
                                  shortId: short._id,
                                  commentId: com._id,
                                  replyText: replyText[com._id],
                                });
                                setReplyText((prev) => ({
                                  ...prev,
                                  [com._id]: "",
                                }));
                              }}
                            >
                              {loading2 ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                "Reply"
                              )}
                            </button>
                          </div>
                        )}

                        <div className="ml-5 mt-2 space-y-2">
                          {com?.replies.map((reply) => (
                            <div
                              key={reply._id}
                              className="bg-gray-800/40 p-2 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={reply?.author?.avatar}
                                  alt="avatar"
                                  className="w-6 h-6 rounded-full"
                                />
                                <h3 className="text-sm font-semibold">
                                  {reply?.author?.username}
                                </h3>
                              </div>
                              <p className="text-sm ml-8">{reply?.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No comments yet</p>
                  )}
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
