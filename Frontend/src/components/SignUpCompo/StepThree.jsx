import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import logo from "../../../public/play_13955998.png";

const StepThree = ({
  frontendImage,
  handleImage,
  backendImage,
  coverImage,
  setCoverImage,
  loading,
  onSubmit,
  step,
  setStep,
}) => {
  return (
    <fieldset className="bg-[#202124] rounded-box w-xs border p-4 shadow-lg">
      <div className="flex items-center mb-6">
        <button
          className="text-gray-300 mr-3 hover:text-white"
          onClick={() => setStep(step - 1)}
        >
          <FaArrowLeft size={20} />
        </button>
        <span className="text-white text-2xl font-medium">Create Account</span>
      </div>

      <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <span>Choose Avatar</span>
      </h1>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex flex-col items-center mt-6">
          <div className="w-18 h-18 rounded-full border-4 border-gray-500 overflow-hidden shadow-lg">
            {frontendImage ? (
              <img
                src={frontendImage}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle
                className="text-gray-300 w-full h-full p-2"
                size={20}
              />
            )}
          </div>

          {coverImage && (
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Cover"
              className="w-20 h-10 object-cover rounded mt-5"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="label text-white text-lg ml-5">Avatar Image</label>
          <input
            type="file"
            accept="image/*"
            className="file-input rounded-full w-[230px]"
            onChange={handleImage}
          />

          <label className="label text-white text-lg ml-5">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            className="file-input rounded-full w-[230px]"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>
      </div>

      <button
        className="btn btn-neutral w-40 rounded-full mt-4 ml-40"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner text-white" />
        ) : (
          <span className="flex items-center gap-1">
            Create Account
            <MdKeyboardArrowRight size={20} />
          </span>
        )}
      </button>
    </fieldset>
  );
};

export default StepThree;
