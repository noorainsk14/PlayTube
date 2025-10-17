import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import ShortCard from "../components/ShortCard";
import { SiYoutubeshorts } from "react-icons/si";

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

const RecommendedContent = () => {
  const { recommendedContent } = useSelector((state) => state.user);
  const [duration, setDuration] = useState({});

  const allVideos = [
    ...(recommendedContent?.recommendedVideos || []),
    ...(recommendedContent?.remainingVideos || []),
  ];

  const allShorts = [
    ...(recommendedContent?.recommendedShorts || []),
    ...(recommendedContent?.remainingShorts || []),
  ];

  useEffect(() => {
    if (Array.isArray(allVideos) && allVideos.length > 0) {
      allVideos.forEach((video) => {
        if (!duration[video._id]) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDuration((prev) => ({
              ...prev,
              [video._id]: formattedTime,
            }));
          });
        }
      });
    }
  }, [recommendedContent]);

  if (!allVideos.length && !allShorts.length) {
    return (
      <div className="px-6 py-4 text-gray-400 text-lg">
        No recommended content available.
      </div>
    );
  }

  return (
    <div className="px-6 py-4 mb-[20px]">
      {/* Videos Section */}
      {allVideos.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recommended Videos</h2>
          <div className="flex flex-wrap gap-6">
            {allVideos.map((video) => (
              <VideoCard
                key={video._id}
                thumbnail={video?.thumbnail}
                duration={duration[video._id] || "0:00"}
                channelLogo={video?.channel?.avatar}
                title={video?.title}
                views={video?.views}
                channelName={video?.channel?.name}
                id={video?._id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Shorts Section */}
      {allShorts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="w-7 h-7 text-red-600" /> Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {allShorts.map((short) => (
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
        </div>
      )}
    </div>
  );
};

export default RecommendedContent;
