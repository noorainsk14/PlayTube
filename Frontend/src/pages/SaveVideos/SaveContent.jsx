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

const SaveContent = () => {
  const [savedVideo, setSavedVideo] = useState([]);
  const [savedShort, setSavedShort] = useState([]);
  const videoData = useSelector(selectVideoData);
  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (Array.isArray(savedVideo) && savedVideo.length > 0) {
      savedVideo.forEach((videos) => {
        getVideoDuration(videos.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formattedTime }));
        });
      });
    }
  }, [savedVideo]);

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        const videoResult = await axios.get(
          `${serverUrl}/api/v1/video/saved-videos`,
          { withCredentials: true }
        );
        console.log(videoResult.data?.data?.savedVideos);
        setSavedVideo(videoResult.data?.data?.savedVideos);

        const shortResult = await axios.get(
          `${serverUrl}/api/v1/short/saved-shorts`,
          { withCredentials: true }
        );
        console.log(shortResult.data?.data?.savedShorts);
        setSavedShort(shortResult.data?.data?.savedShorts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSavedContent();
  }, []);

  if (
    (!savedShort && !savedVideo) ||
    (savedShort.length === 0 && savedVideo.length === 0)
  ) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-400 text-xl">
        {" "}
        No Saved Videos Found
      </div>
    );
  }
  return (
    <div className="px-6 py-4 min-h-screen mt-[50px] lg:mt[20px]">
      {savedShort.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-red-600" />
            Saved Shorts
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {savedShort?.map((short) => (
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

      {savedVideo.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="w-7 h-7 text-red-600" />
            Saved Videos
          </h2>

          <div className="flex flex-wrap gap-6 ">
            {savedVideo?.map((video) => (
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

export default SaveContent;
