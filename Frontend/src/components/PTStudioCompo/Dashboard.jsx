import React from "react";
import { useSelector } from "react-redux";
import AnaliticsCard from "./AnaliticsCard";
import { useNavigate } from "react-router-dom";
import ContentCard from "./ContentCard";
import DashbordShortCard from "./DashbordShortCard";

const Dashboard = () => {
  const { channelData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Helper to safely parse view counts
  const parseViews = (views) => {
    const num = Number(views);
    return isNaN(num) ? 0 : num;
  };

  // Calculate total views safely
  const totalVideoViews = (channelData?.videos || []).reduce(
    (acc, video) => acc + parseViews(video?.views),
    0
  );

  const totalShortViews = (channelData?.shorts || []).reduce(
    (acc, short) => acc + parseViews(short?.views),
    0
  );

  const totalViews = totalVideoViews + totalShortViews;

  return (
    <div className="w-full text-white min-h-screen p-4 sm:p-6 space-y-6 mb-[50px]">
      {/* Channel Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
        <img
          src={channelData?.avatar}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover border border-gray-700"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-lg sm:text-xl font-bold">
            {channelData?.name || "Unnamed Channel"}
          </h2>
          <p className="text-sm text-gray-400">
            {channelData?.subscribers?.length || 0} Total Subscribers
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
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
          <AnaliticsCard
            label="Subscribers"
            value={`+${channelData?.subscribers?.length || 0}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {channelData?.videos.length > 0 && (
            <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
              Latest Videos
            </h3>
          )}
          <div className="space-y-4">
            {(channelData?.videos)
              .slice()
              .reverse()
              .slice(0, 5)
              .map((v, idx) => (
                <ContentCard
                  key={idx}
                  content={v}
                  onClick={() => {
                    navigate(`/play-video/${v?._id}`);
                  }}
                />
              ))}
          </div>
        </div>

        <div>
          {channelData?.shorts?.length > 0 && (
            <h3 className="pl-1 text-start sm:text-lg font-semibold mb-3">
              Latest Shorts
            </h3>
          )}
          <div className="space-y-4">
            {(channelData?.shorts)
              .slice()
              .reverse()
              .slice(0, 5)
              .map((s, idx) => (
                <DashbordShortCard
                  key={idx}
                  content={s}
                  onClick={() => {
                    navigate(`/play-short/${s?._id}`);
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
