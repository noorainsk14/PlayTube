import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import logo from "../../assets/play_13955998.png";
import { useNavigate } from "react-router-dom";

const StepTwo = ({
  email,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
  onSubmit,
  step,
  setStep,
}) => {
  const navigate = useNavigate();
  return (
    <fieldset className="bg-[#202124] rounded-box w-xs border p-4 shadow-lg">
      <div className="flex items-center mb-6">
        <button
          className="text-gray-300 mr-3 hover:text-white"
          onClick={() => setStep(step - 1)}
        >
          <FaArrowLeft size={20} />
        </button>
        <span className="text-white text-2xl font-medium">SignIn</span>
      </div>

      <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <span>Welcome</span>
      </h1>

      <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-2">
        <FaUserCircle className="text-white mr-2" size={20} />
        {email}
      </div>

      <label className="label text-white mb-2.5">Password</label>
      <input
        type={showPassword ? "text" : "password"}
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="label text-white mt-2">
        <input
          type="checkbox"
          className="checkbox checkbox-neutral bg-white mr-2"
          onChange={() => setShowPassword(!showPassword)}
        />
        Show Password
      </label>

      <div className="flex justify-between items-center mt-6">
        <button
          className="text-orange-400 text-sm hover:underline hover:cursor-pointer mt-4"
          onClick={() => {
            navigate("/change-password");
          }}
        >
          forget password
        </button>
        <button
          className="btn btn-neutral w-30 rounded-full mt-4 "
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner text-white" />
          ) : (
            <span className="flex items-center gap-1">
              SignIn
              <MdKeyboardArrowRight size={20} />
            </span>
          )}
        </button>
      </div>
    </fieldset>
  );
};

export default StepTwo;
