import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AnaliticsCard from "./AnaliticsCard";
import ContentCard from "./ContentCard";
import DashbordShortCard from "./DashbordShortCard";

const Dashboard = () => {
  const { channelData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // 🆕 Added: Loading screen to prevent rendering errors while data is still undefined
  if (!channelData) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-white">
        <p className="text-lg font-semibold animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // ✅ Safe helper for parsing numeric view counts (same as before)
  const parseViews = (views) => {
    const num = Number(views);
    return isNaN(num) ? 0 : num;
  };

  // 🆕 Added safe fallbacks (empty arrays) to avoid "reduce of undefined" errors
  const totalVideoViews = (channelData.videos || []).reduce(
    (acc, video) => acc + parseViews(video?.views),
    0
  );

  const totalShortViews = (channelData.shorts || []).reduce(
    (acc, short) => acc + parseViews(short?.views),
    0
  );

  const totalViews = totalVideoViews + totalShortViews;
  const totalSubscribers = channelData.subscribers?.length || 0;

  return (
    <div className="w-full text-white min-h-screen p-4 sm:p-6 space-y-6 mb-[50px]">
      {/* 🧑 Channel Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        <img
          // 🆕 Added fallback avatar in case image URL is missing
          src={channelData.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover border border-gray-700"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold">
            {channelData.name || "Unnamed Channel"} {/* 🆕 Fallback name */}
          </h2>
          <p className="text-sm text-gray-400">
            {totalSubscribers} Total Subscribers
          </p>
        </div>
      </div>

      {/* 📊 Analytics Cards */}
      <div>
        <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
          Channel Analytics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <AnaliticsCard
            label="Views"
            value={totalViews}
            onClick={() => navigate("/PT-studio/analytics")}
          />
          <AnaliticsCard label="Subscribers" value={`+${totalSubscribers}`} />
        </div>
      </div>

      {/* 🎥 Latest Videos + Shorts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🎞 Latest Videos Section */}
        <div>
          {/* 🆕 Wrapped with Array.isArray() to ensure no .slice() on undefined */}
          {Array.isArray(channelData.videos) &&
            channelData.videos.length > 0 && (
              <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
                Latest Videos
              </h3>
            )}
          <div className="space-y-4">
            {Array.isArray(channelData.videos) &&
              channelData.videos
                .slice()
                .reverse()
                .slice(0, 5)
                // 🆕 Added safe key fallback (v._id || idx)
                .map((v, idx) => (
                  <ContentCard
                    key={v._id || idx}
                    content={v}
                    onClick={() => navigate(`/play-video/${v?._id}`)}
                  />
                ))}
          </div>
        </div>

        {/* 🎬 Latest Shorts Section */}
        <div>
          {/* 🆕 Same safe guard for shorts */}
          {Array.isArray(channelData.shorts) &&
            channelData.shorts.length > 0 && (
              <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
                Latest Shorts
              </h3>
            )}
          <div className="space-y-4">
            {Array.isArray(channelData.shorts) &&
              channelData.shorts
                .slice()
                .reverse()
                .slice(0, 5)
                .map((s, idx) => (
                  <DashbordShortCard
                    key={s._id || idx}
                    content={s}
                    onClick={() => navigate(`/play-short/${s?._id}`)}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
