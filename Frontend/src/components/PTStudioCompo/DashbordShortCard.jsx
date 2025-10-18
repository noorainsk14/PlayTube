import React from "react";
import { FaComment, FaEye, FaThumbsUp } from "react-icons/fa";

const DashbordShortCard = ({ onClick, content }) => {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition"
      onClick={onClick}
    >
      {/* thumbnail  */}

      <video
        src={content?.shortUrl}
        className="w-20 h-24 object-cover"
        muted
        playsInline
        preload="metadata"
        onContextMenu={(e) => e.preventDefault}
      />

      {/* content Info  */}

      <div className="flex-1">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <h4 className="font-semibold text-sm sm:text-base line-clamp-2">
            {content?.title}
          </h4>

          <p className="text-xs text-gray-400 mt-1">
            Published {new Date(content?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* stats  */}
        <div
          className="flex flex-wrap gap-4 mt-2 text-gray-300 text-sm
                    "
        >
          <span className="flex items-center gap-1">
            <FaEye /> {content?.views || 0}
          </span>
          <span className="flex items-center gap-1">
            {" "}
            <FaThumbsUp />
            {content?.likes?.length}
          </span>
          <span className="flex items-center gap-1">
            {" "}
            <FaComment />
            {content?.comments?.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashbordShortCard;
