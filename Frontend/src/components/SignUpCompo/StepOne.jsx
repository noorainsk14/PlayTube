import { FaArrowLeft } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import logo from "../../assets/play_13955998.png";

const StepOne = ({
  fullName,
  setFullName,
  username,
  setUsername,
  email,
  setEmail,
  onNext,
  step,
  setStep,
}) => {
  return (
    <fieldset className="bg-[#202124] rounded-box w-xs border p-4 shadow-lg">
      <div className="flex items-center mb-6">
        <button
          className="text-gray-300 mr-3 hover:text-white"
          onClick={() => (step > 1 ? setStep(step - 1) : history.back())}
        >
          <FaArrowLeft size={20} />
        </button>
        <span className="text-white text-2xl font-medium">Create Account</span>
      </div>

      <h1 className="text-3xl font-normal text-white mb-4 flex items-center gap-2">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <span>Basic Info</span>
      </h1>

      <label className="label text-white">Full Name</label>
      <input
        type="text"
        className="input"
        placeholder="Joe Doe"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <label className="label text-white">Username</label>
      <input
        type="text"
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="label text-white">Email</label>
      <input
        type="email"
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

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

export default StepOne;
