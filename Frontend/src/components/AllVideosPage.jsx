import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import VideoCard from "./VideoCard";

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

const AllVideosPage = () => {
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
  return (
    <div className="flex flex-wrap gap-6 mb-12 md:justify-start sm:items-center sm:justify-center">
      {videoData?.map((video) => (
        <VideoCard
          key={video?._id}
          duration={duration[video?._id] || "0:00"}
          thumbnail={video?.thumbnail}
          title={video?.title}
          channelLogo={video?.channel?.avatar}
          channelName={video?.channel?.name}
          id={video._id}
        />
      ))}
    </div>
  );
};

export default AllVideosPage;
