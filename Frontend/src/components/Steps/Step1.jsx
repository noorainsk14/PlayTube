import { FaArrowLeft } from "react-icons/fa";
import logo from "../../../public/play_13955998.png";
import { MdKeyboardArrowRight } from "react-icons/md";

const Steps = () => {
  return (
    <div>
      <fieldset className="fieldset bg-[#202124]  rounded-box w-xs border p-4 shadow-lg">
        <div className="flex items-center mb-6">
          <button className="text-gray-300 mr-3 hover:text-white cursor-pointer">
            <FaArrowLeft size={20} />
          </button>
          <span className="text-white text-2xl font-medium">
            Create Account
          </span>
        </div>
        <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <span>Basic Info</span>
        </h1>
        <label className="label text-white">Full Name</label>
        <input type="text" className="input" placeholder="Joe Doe" />

        <label className="label text-white">Username</label>
        <input type="text" className="input" placeholder="Username" />

        <label className="label text-white">Email</label>
        <input type="email" className="input" placeholder="Email" />

        <button className="btn btn-neutral w-30 rounded-full  mt-4 ml-40">
          Next
          <MdKeyboardArrowRight size={20} className="" />
        </button>
      </fieldset>
    </div>
  );
};

export default Steps;
