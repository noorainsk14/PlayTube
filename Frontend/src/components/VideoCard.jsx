import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VideoCard = ({
  thumbnail,
  duration,
  channelLogo,
  title,
  channelName,
  views,
  id,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-[360] cursor-pointer"
      onClick={() => {
        navigate(`/play-video/${id}`);
      }}
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="rounded-xl w-full h-[200px] border-1 border-b-gray-800 object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black text-white text-xs rounded">
          {duration}
        </span>
      </div>

      <div className="flex mt-3">
        <img
          src={channelLogo}
          alt={channelLogo}
          className="w-10 h-10 rounded-full mr-3"
        />

        <div>
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{channelName}</p>
          <p className="text-xs text-gray-400">0{views}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
