import { useNavigate } from "react-router-dom";

const ShortCard = ({ shortUrl, title, channelName, avatar, views, id }) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-45 sm:48 cursor-pointer relative"
      onClick={() => {
        navigate(`/play-short/${id}`);
      }}
    >
      <div className="rounded-xl overflow-hidden bg-black w-full h-70 border-1 border-gray-700">
        <video
          src={shortUrl}
          className="w-full h-full object-cover "
          muted
          playsInline
          onContextMenu={(e) => e.preventDefault}
          preload="metadata"
        ></video>
      </div>
      <div className="mt-2 space-y-2 w-full absolute bottom-0 p-3 bg-[#000000b6] rounded-xl">
        <h3 className="text-sm font-semibold text-white line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center justify-start gap-1">
          <img
            src={avatar}
            alt={avatar}
            className="w-4 h-4 object-cover rounded-full"
          />
          <p className="text-xs text-gray-400">{channelName}</p>
        </div>
        <p className="text-xs text-gray-400">{views} views</p>
      </div>
    </div>
  );
};

export default ShortCard;
