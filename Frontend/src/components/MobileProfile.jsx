import React from "react";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineSwitchAccount } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { FiLogOut } from "react-icons/fi";
import { IoSettingsSharp } from "react-icons/io5";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLogIn } from "react-icons/fi";
import { setUserData } from "../redux/userSlice";

import {
  FaUserCircle,
  FaSearch,
  FaMicrophone,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaTimes,
} from "react-icons/fa";

const MobileProfile = () => {
  const userData = useSelector((state) => state.user);
  return (
    <div className=" md:hidden bg-[#0f0f0f] text-white h[100%] w-[100%] flex flex-col pt-[100px] p-[10px]">
      {/* top Profile section */}
      {userData && (
        <div className="p-4 flex items-center gap-4 border-b border-gray-800">
          <img
            src={userData?.userData?.avatar}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />

          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {`@${userData?.userData?.username}`}
            </span>
            <span className="text-gray-400 text-sm">
              {userData?.userData?.email}
            </span>
            <p className="text-sm text-blue-400 cursor-pointer">
              {userData?.userData?.channel ? "view channel" : "create channel"}
            </p>
          </div>
        </div>
      )}

      {/* auth button */}
      <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
        <button className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2">
          <FcGoogle className="text-xl " />
          SignIn with Google account
        </button>
        <button className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2">
          <TiUserAddOutline className="text-xl " />
          Create new account
        </button>
        <button className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2">
          <MdOutlineSwitchAccount className="text-xl " />
          SignIn with other account
        </button>
        <button className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2">
          <SiYoutubestudio className="text-xl text-orange-400 " />
          PT Studio
        </button>
        <button className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2">
          <FiLogOut className="text-xl " />
          SignOut
        </button>
      </div>
    </div>
  );
};

export default MobileProfile;
