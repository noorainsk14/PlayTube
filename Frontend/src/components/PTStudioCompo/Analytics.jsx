import React from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const { channelData } = useSelector((state) => state.user);

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading Channel Data.....
      </div>
    );
  }

  const videoChartData = (channelData?.videos || []).map((video) => ({
    title:
      video.title.length > 10 ? video.title.slice(0, 10) + "..." : video.title,
    views: video.views || 0,
  }));

  const shortChartData = (channelData?.shorts || []).map((short) => ({
    title:
      short.title.length > 10 ? short.title.slice(0, 10) + "..." : short.title,
    views: short.views || 0,
  }));

  return (
    <div className="w-full min-h-screen sm:p-6 p-4 text-white space-y-8 mb-[50px]">
      <h1 className="text-2xl font-bold">
        Channel Analytics (Videos & Shorts)
      </h1>

      {/* video charts  */}
      <div className=" bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Video Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#88848d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* shorts charts  */}
      <div className=" bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Short Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#88848d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
