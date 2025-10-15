import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import VideoCard from "../../components/VideoCard";
import { createSelector } from "@reduxjs/toolkit";
import ShortCard from "../../components/ShortCard";
import PlaylistCard from "../../components/PlaylistCard";
import PostCard from "../../components/PostCard";

const selectVideoData = createSelector(
  (state) => state.content?.videoData,
  (videoData) => videoData ?? []
);

const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;
  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };
  video.onerror = () => {
    callback("0:00");
  };
};

const ChannelPage = () => {
  const { id: channelId } = useParams();
  const { allChannelData, userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const channelData = allChannelData?.find((c) => c._id === channelId);
  const [channel, setChannel] = useState(channelData);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");
  const dispatch = useDispatch();
  const videoData = useSelector(selectVideoData);
  const [duration, setDuration] = useState({});

  const handleSubscribe = async () => {
    if (!channel || !channel._id) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/v1/channel/toggle-subscribe`,
        { channelId: channel._id },
        { withCredentials: true }
      );
      console.log(response.data.data.updatedChannel);

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

  useEffect(() => {
    if (Array.isArray(videoData) && videoData.length > 0) {
      videoData.forEach((videos) => {
        getVideoDuration(videos.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formattedTime }));
        });
      });
    }
  }, [videoData]);

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
    <div className="text-white min-h-screen pt-15">
      {/* banner */}

      <div className="relative">
        <img
          src={channel?.coverImage}
          alt="coverImage"
          className="w-full h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* channelInfo */}

      <div
        className="relative flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl
       flex-wrap"
      >
        <div>
          <img
            src={channel?.avatar}
            alt="avatar"
            className="rounded-full w-28 h-28 border-4 border-gray-800 shadow-lg hover:scale-105 hover:ring-4 hover:ring-orange-600 transition-transform duration-300"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-wide">
            {channel?.name}
          </h1>
          <p className="text-gray-400 mt-1">
            <span className="font-semibold text-white">
              {channel?.subscribers?.length}
            </span>
            &nbsp;Subscribers&nbsp;&nbsp;
            <span className="font-semibold text-white">
              {channel?.videos?.length}
            </span>
            &nbsp;Videos
          </p>
          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
            {channel?.category}
          </p>
        </div>
        <button
          style={{ minWidth: "120px" }}
          disabled={loading}
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

      {/* tab  */}
      <div className="flex gap-8 px-6 py-1 border-b border-gray-800 mb-6 relative">
        {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
          <button
            key={tab}
            className={`pb-3 relative font-medium transition ${
              activeTab === tab
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}{" "}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>
      <div className="px-6 space-y-8">
        {activeTab === "Videos" && (
          <div className="flex flex-wrap gap-5 pb-[40px]">
            {channel?.videos?.map((v) => (
              <VideoCard
                key={v?._id}
                duration={duration[v?._id] || "0:00"}
                thumbnail={v?.thumbnail}
                title={v?.title}
                channelLogo={channel?.avatar}
                channelName={channel?.name}
                id={v._id}
                views={v?.views}
              />
            ))}
          </div>
        )}

        {activeTab === "Shorts" && (
          <div className="flex gap-4 flex-wrap">
            {channel.shorts?.map((short) => (
              <ShortCard
                key={short._id}
                shortUrl={short?.shortUrl}
                title={short?.title}
                avatar={channel?.avatar}
                channelName={channel?.name}
                id={short?._id}
                views={short?.views}
              />
            ))}
          </div>
        )}

        {activeTab === "Playlists" && (
          <div className="flex gap-4 flex-wrap">
            {channel.playlist?.map((p) => (
              <PlaylistCard
                key={p._id}
                title={p?.title}
                id={p?._id}
                videos={p.videos}
                savedBy={p.savedBy}
              />
            ))}
          </div>
        )}
        {activeTab === "Community" && (
          <div className="flex gap-4 flex-wrap">
            {channel.communityPost?.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
