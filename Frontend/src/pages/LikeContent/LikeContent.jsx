import React, { useEffect, useState } from "react";
import { serverUrl } from "../../App";
import axios from "axios";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../../components/VideoCard";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

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

const LikeContent = () => {
  const [likedvideo, setLikedvideo] = useState([]);
  const [likedShort, setLikedShort] = useState([]);
  const videoData = useSelector(selectVideoData);
  const [duration, setDuration] = useState({});

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
    const fetchLikedContent = async () => {
      try {
        const videoResult = await axios.get(
          `${serverUrl}/api/v1/video/liked-videos`,
          { withCredentials: true }
        );
        console.log(videoResult.data?.data?.likeVideos);
        setLikedvideo(videoResult.data?.data?.likeVideos);

        const shortResult = await axios.get(
          `${serverUrl}/api/v1/short/liked-shorts`,
          { withCredentials: true }
        );
        console.log(shortResult.data?.data?.likeShorts);
        setLikedShort(shortResult.data?.data?.likeShorts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLikedContent();
  }, []);
  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt[20px]">
      {likedShort.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-red-600" />
            Liked Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {likedShort?.map((short) => (
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

      {likedvideo.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="w-7 h-7 text-red-600" />
            Liked Videos
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {likedvideo?.map((video) => (
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
    </div>
  );
};

export default LikeContent;
