import React from "react";
import { useSelector } from "react-redux";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "./ShortCard";

const AllShortsPage = () => {
  const { shortData } = useSelector((state) => state.content);
  const latestShort = shortData?.slice(0, 10 || []);
  return (
    <div className="px-6 py-4">
      <h2 className="text-xs font-bold mb-4 flex items-center gap-1">
        <SiYoutubeshorts className="w-6 h-6 text-orange-600" />
        Shorts
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {latestShort?.map((short) => (
          <div className="flex-shrink-0" key={short?._id}>
            <ShortCard
              shortUrl={short?.shortUrl}
              title={short?.title}
              avatar={short?.channel?.avatar}
              channelName={short?.channel?.name}
              id={short?._id}
              views={short?.views}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllShortsPage;
