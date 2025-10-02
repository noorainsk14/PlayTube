const StepTwo = ({
  avatar,
  setAvatar,
  channelName,
  setChannelName,
  onChange,
  prevStep,
  onClick,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4"> Your Channel</h2>

      <div className="flex flex-col items-center mb-6">
        <label className="cursor-pointer flex flex-col items-center ">
          {avatar ? (
            <img
              src={URL.createObjectURL(avatar)}
              className="w-20 h-20 rounded-2xl object-cover border-b border-gray-600"
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
        disabled={!channelName}
        className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition py-3 rounded-lg font-meduim disabled:bg-gray-600 cursor-pointer"
      >
        Continue and Create Channel
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
