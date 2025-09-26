import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import logo from "../../../public/play_13955998.png";

const StepTwo = ({
  email,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  onNext,
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
        <span>Security</span>
      </h1>

      <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-2">
        <FaUserCircle className="text-white mr-2" size={20} />
        {email}
      </div>

      <label className="label text-white">Password</label>
      <input
        type={showPassword ? "text" : "password"}
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="label text-white">Confirm Password</label>
      <input
        type={showPassword ? "text" : "password"}
        className="input"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <label className="label text-white mt-2">
        <input
          type="checkbox"
          className="checkbox checkbox-neutral bg-white mr-2"
          onChange={() => setShowPassword(!showPassword)}
        />
        Show Password
      </label>

      <button
        className="btn btn-neutral w-30 rounded-full mt-4 ml-40"
        onClick={onNext}
      >
        Next
        <MdKeyboardArrowRight size={20} />
      </button>
    </fieldset>
  );
};

export default StepTwo;
