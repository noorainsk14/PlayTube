import { FaUserCircle } from "react-icons/fa";

const StepTwo = ({
  avatar,
  setAvatar,
  channelName,
  headline,
  setChannelName,
  onChange,
  button,
  prevStep,
  onClick,
  existingAvatarUrl, // NEW PROP
}) => {
  let avatarPreview = null;

  if (avatar) {
    avatarPreview = URL.createObjectURL(avatar);
  } else if (existingAvatarUrl) {
    avatarPreview = existingAvatarUrl;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{headline}</h2>

      <div className="flex flex-col items-center mb-6">
        <label className="cursor-pointer flex flex-col items-center">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-20 h-20 rounded-2xl object-cover border-b border-gray-600"
              alt="avatar preview"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
              <FaUserCircle size={40} />
            </div>
          )}

          <input
            type="file"
            className="hidden"
            id="avatar"
            accept="image/*"
            onChange={onChange}
          />
        </label>

        <h2 className="mt-3 text-lg font-semibold">{channelName}</h2>
      </div>

      <button
        onClick={onClick}
        disabled={!channelName || (!avatar && !existingAvatarUrl)}
        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition py-3 rounded-lg font-medium disabled:bg-gray-600 cursor-pointer"
      >
        {button}
      </button>

      <span
        className="w-full flex items-center justify-center text-sm text-orange-400 cursor-pointer hover:underline mt-2"
        onClick={prevStep}
      >
        Back
      </span>
    </div>
  );
};

export default StepTwo;
