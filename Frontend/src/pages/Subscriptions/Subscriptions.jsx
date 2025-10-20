import React, { useEffect, useState } from "react";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";
import { GoVideo } from "react-icons/go";
import { RiUserCommunityFill } from "react-icons/ri";
import { createSelector } from "@reduxjs/toolkit";
import { FaList } from "react-icons/fa";
import PlaylistCard from "../../components/PlaylistCard";
import PostCard from "../../components/PostCard";

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

const Subscriptions = () => {
  const {
    subscribedChannels,
    subscribedVideos,
    subscribedShorts,
    subscribedPlaylists,
    subscribedPosts,
  } = useSelector((state) => state.user);
  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (Array.isArray(subscribedVideos) && subscribedVideos.length > 0) {
      subscribedVideos.forEach((videos) => {
        getVideoDuration(videos.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formattedTime }));
        });
      });
    }
  }, [subscribedVideos]);

  const navigate = useNavigate();

  if (!subscribedChannels) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
        {" "}
        No Subscribed Videos Found
      </div>
    );
  }

  return (
    <div className="px-6 py-4 min-h-screen">
      {/* subscribedChannels   */}

      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar pt-[30px]">
        {subscribedChannels?.map((ch) => (
          <div
            key={ch?._id}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200 "
            onClick={() => {
              navigate(`/channel-page/${ch?._id}`);
            }}
          >
            <img
              src={ch?.avatar}
              alt="avata"
              className="w-18 j-18 rounded-full border-2 border-gray-600 object-cover shadow-md"
            />
            <span className="mt-2 text-sm text-gray-300 font-medium text-center truncate w-20">
              {ch?.name}
            </span>
          </div>
        ))}
      </div>

      {/* short section */}
      {subscribedShorts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-red-600" />
            Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {subscribedShorts?.map((short) => (
              <div key={short?._id} className="flex-shrink-0">
                <ShortCard
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  views={short?.views}
                  id={short?._id}
                  avatar={short?.channel?.avatar}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {subscribedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="w-7 h-7 text-red-600" />
            Videos
          </h2>

          <div className="flex flex-wrap gap-6">
            {subscribedVideos?.map((video) => (
              <div key={video?._id} className="flex-shrink-0">
                <VideoCard
                  thumbnail={video?.thumbnail}
                  duration={duration[video._id] || "0:00"}
                  channelLogo={video?.channel?.avatar}
                  title={video?.title}
                  views={video?.views}
                  channelName={video?.channel?.name}
                  id={video?._id}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {subscribedPlaylists.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <FaList className="w-7 h-7 text-red-600" />
            Playlist
          </h2>
          <div className="flex flex-wrap gap-6">
            {subscribedPlaylists?.map((pl) => (
              <PlaylistCard
                key={pl?._id}
                id={pl?._id}
                title={pl?.title}
                videos={pl?.videos}
                savedBy={pl?.savedBy}
              />
            ))}
          </div>
        </>
      )}

      {subscribedPosts.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <RiUserCommunityFill className="w-7 h-7 text-red-600" />
            Community
          </h2>
          <div className="flex flex-wrap gap-6">
            {subscribedPosts?.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Subscriptions;
