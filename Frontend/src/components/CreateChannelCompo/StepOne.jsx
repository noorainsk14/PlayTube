import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const StepOne = ({
  avatar,
  setAvatar,
  existingAvatarUrl,
  channelName,
  setChannelName,
  headline,
  onChange,
  onClick,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4"> {headline}</h2>
      <p className="text-sm text-gray-400 mb-6">
        Choose your profile picture, channel name
      </p>

      <div className="flex flex-col items-center mb-6">
        <label
          htmlFor="avatar"
          className="cursor-pointer flex flex-col items-center "
        >
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              className="w-20 h-20 rounded-2xl object-cover border-b border-gray-600"
            />
          ) : existingAvatarUrl ? (
            <img
              src={existingAvatarUrl}
              className="w-20 h-20 rounded-2xl object-cover border-b border-gray-600"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
              <FaUserCircle size={40} />
            </div>
          )}
          <span className="text-orange-400 text-sm my-2">Upload Avatar</span>
          <input
            type="file"
            className="hidden"
            id="avatar"
            accept="image/*"
            onChange={onChange}
          />
        </label>
      </div>
      <input
        type="text"
        placeholder="Channel Name"
        className="w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={channelName || ""}
        onChange={(e) => {
          setChannelName(e.target.value);
        }}
      ></input>

      <button
        onClick={onClick}
        disabled={!channelName || (!avatar && !existingAvatarUrl)}
        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition py-3 rounded-lg font-meduim disabled:bg-gray-600 "
      >
        Continue
      </button>
      <span
        className="w-full flex items-center justify-center text-sm text-orange-400 cursor-pointer hover:underline mt-2"
        onClick={() => navigate("/")}
      >
        Back to Home
      </span>
    </div>
  );
};

export default StepOne;
