import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const calculationRevenue = (views, type) => {
  if (type === "video") {
    if (views < 1000) return 0;
    return Math.floor(views / 1000) + 50;
  }

  if (type === "short") {
    if (views < 10000) return 0;
    return Math.floor(views / 10000) + 50;
  }
  return 0;
};

const Revenue = () => {
  const { channelData } = useSelector((state) => state.user);
  const [contentRevenue, setContentRevenue] = useState(null);

  if (!channelData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading Channel Data.....
      </div>
    );
  }

  const videoRevenueData = (channelData?.videos || []).map((video) => ({
    title:
      video.title.length > 10 ? video.title.slice(0, 10) + "..." : video.title,
    revenue: calculationRevenue(video.views || 0, "video"),
  }));

  const shortRevenueData = (channelData?.shorts || []).map((short) => ({
    title:
      short.title.length > 10 ? short.title.slice(0, 10) + "..." : short.title,
    revenue: calculationRevenue(short.views || 0, "short"),
  }));

  const totalRevenue =
    videoRevenueData.reduce((sum, v) => sum + v.revenue, 0) +
    shortRevenueData.reduce((sum, s) => sum + s.revenue, 0);

  useEffect(() => {
    setContentRevenue(totalRevenue);
  }, [totalRevenue]);

  return (
    <div className="w-full min-h-screen sm:p-6 p-4 text-white space-y-8 mb-[50px]">
      <h1 className="text-2xl font-bold flex justify-center items-center gap-2">
        <RiMoneyRupeeCircleFill className="text-orange-400" />
        Revenue Analytics
      </h1>

      {/* revenue rulees  */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-400 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          Revenue Rules
        </h2>
        <h2>
          <ul className="text-sm space-y-1 text-gray-800">
            <li>🎬 Videos → ₹50 per 1,000 views (after first 1,000)</li>
            <li>📱 Shorts → ₹50 per 10,000 views (after first 10,000)</li>
          </ul>
        </h2>
      </div>

      {/* video revenue chart  */}
      <div className=" bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Video Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={videoRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#88848d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* shorts revenue charts  */}
      <div className=" bg-[#0b0b0b] border border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Short Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={shortRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#88848d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {
        <div className="border bg-[#0b0b0b] border-gray-700 rounded-lg p-4 text-center">
          <h2 className="text-lg font-semibold mb-2 ">
            Total Estimated Revenue
          </h2>
          <p className="text-xl font-bold text-yellow-400">₹ {totalRevenue}</p>
        </div>
      }
    </div>
  );
};

export default Revenue;
