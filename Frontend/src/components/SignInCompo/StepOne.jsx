import { FaArrowLeft } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import logo from "../../assets/play_13955998.png";
import { useNavigate } from "react-router-dom";

const StepOne = ({ identifier, setIdentifier, onNext, step, setStep }) => {
  const navigate = useNavigate();
  return (
    <fieldset className="bg-[#202124] rounded-box w-xs border p-4 shadow-lg">
      <div className="flex items-center mb-6">
        <button
          className="text-gray-300 mr-3 hover:text-white"
          onClick={() => (step > 1 ? setStep(step - 1) : history.back())}
        >
          <FaArrowLeft size={20} />
        </button>
        <span className="text-white text-2xl font-medium">PlayTube</span>
      </div>

      <h1 className="text-3xl font-normal text-white mb-4 flex items-center gap-2">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <span>SignIn</span>
      </h1>

      <label className="label text-gray-300 text-sm mb-3">
        with your Account to continue PlayTube
      </label>
      <input
        type="text"
        className="input"
        placeholder="username or email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <div className="flex justify-between items-center mt-10">
        <button
          className="text-orange-400 text-sm hover:underline hover:cursor-pointer"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          Create Account
        </button>
        <button
          className="btn btn-neutral w-30 rounded-full mt-4 ml-10"
          onClick={onNext}
        >
          Next
          <MdKeyboardArrowRight size={20} />
        </button>
      </div>
    </fieldset>
  );
};

export default StepOne;
