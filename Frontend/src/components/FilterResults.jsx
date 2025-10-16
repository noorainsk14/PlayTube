import React, { useEffect, useState } from "react";
import ChannelCard from "./ChannelCard";
import VideoCard from "./VideoCard";
import { createSelector } from "@reduxjs/toolkit";
import PlaylistCard from "./PlaylistCard";
import ShortCard from "./ShortCard";

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

const FilterResults = ({ filterResults }) => {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (
      Array.isArray(filterResults?.videos) &&
      filterResults?.videos.length > 0
    ) {
      filterResults?.videos.forEach((videos) => {
        getVideoDuration(videos.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [videos._id]: formattedTime }));
        });
      });
    }
  }, [filterResults?.videos]);

  const isEmpty =
    (!filterResults?.videos || filterResults.videos.length === 0) &&
    (!filterResults?.shorts || filterResults.shorts.length === 0) &&
    (!filterResults?.channels || filterResults.channels.length === 0) &&
    (!filterResults?.playlists || filterResults.videos.playlists === 0);

  return (
    <div
      className="px-6 bg-[#00000051] border-1
     border-gray-800 mb-[20px] p-10"
    >
      <h2 className="text-2xl font-bold mb-4 ">Filter Results</h2>
      {isEmpty ? (
        <p className="text-gray-400 text-lg">No Results found</p>
      ) : (
        <>
          {/* video section */}
          {filterResults?.videos?.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <div className="flex flex-wrap gap-6 mb-12">
                {filterResults.videos.map((video) => (
                  <VideoCard
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

          {/* short section */}
          {filterResults?.shorts?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {filterResults.shorts.map((short) => (
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
        </>
      )}
    </div>
  );
};

export default FilterResults;
