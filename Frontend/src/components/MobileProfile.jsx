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
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
import MobileProfileMenu from "./MobileProfileMenu";
import { serverUrl } from "../App";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../helper/toastHelper";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

const MobileProfile = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const signOut = await axios.post(
        `${serverUrl}/api/v1/users/logout`,
        null,
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(null));
      console.log(signOut);
      showSuccessToast("SignOut Successfull !");
    } catch (error) {
      console.log(error);
      showErrorToast("SignOut Failed !");
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);

      const user = response.user;

      const idToken = await user.getIdToken();
      const username = user.displayName.replace(/\s+/g, "").toLowerCase(); // clean username
      const fullName = user.displayName;
      const email = user.email;
      const avatar = user.photoURL;

      const result = await axios.post(
        `${serverUrl}/api/v1/users/google-auth`,
        {
          username,
          fullName,
          email,
          avatar,
          idToken,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));
      showSuccessToast("Google Authentication Successfully!!");
    } catch (error) {
      console.log(error);
      showErrorToast("Google Authentication Failed!!");
    }
  };
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
            <p
              className="text-sm text-blue-400 cursor-pointer"
              onClick={() => {
                userData?.channel
                  ? navigate("/view-channel")
                  : navigate("/create-channel");
              }}
            >
              {userData?.userData?.channel ? "view channel" : "create channel"}
            </p>
          </div>
        </div>
      )}

      {/* auth button */}
      <div className="flex gap-2 p-4 border-b border-gray-800 overflow-auto">
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={handleGoogleAuth}
        >
          <FcGoogle className="text-xl " />
          SignIn with Google account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          <TiUserAddOutline className="text-xl " />
          Create new account
        </button>
        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          <MdOutlineSwitchAccount className="text-xl " />
          SignIn with other account
        </button>

        <button
          className="bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2"
          onClick={handleSignOut}
        >
          <FiLogOut className="text-xl " />
          SignOut
        </button>
      </div>

      <div className="flex flex-col mt-[20px] ">
        <MobileProfileMenu icon={<FaHistory />} text={"History"} />
        <MobileProfileMenu icon={<FaList />} text={"Playlist"} />
        <MobileProfileMenu icon={<GoVideo />} text={"Save Videos"} />
        <MobileProfileMenu
          icon={<FaThumbsUp />}
          text={"Like Videos"}
          onClick={() => {
            navigate("/liked-content");
          }}
        />
        <MobileProfileMenu icon={<SiYoutubestudio />} text={"PT Studio"} />
      </div>
    </div>
  );
};

export default MobileProfile;
