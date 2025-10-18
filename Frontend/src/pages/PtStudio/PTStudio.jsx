import React from "react";
import {
  FaUserCircle,
  FaSearch,
  FaMicrophone,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaTimes,
  FaTachometerAlt,
  FaViadeo,
  FaChartBar,
  FaVideo,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdOutlineSwitchAccount } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { FiLogOut } from "react-icons/fi";
import { IoSettingsSharp, IoTelescope } from "react-icons/io5";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLogIn } from "react-icons/fi";
import SideBarItems from "../../components/SideBarItems";
import { RiMoneyCnyCircleFill } from "react-icons/ri";
import MobileSizeNav from "../../components/MobileSizeNav";
const PTStudio = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [active, setActive] = useState("Home");
  const [searchPopup, setSearchPopup] = useState(false);
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const { userData, channelData, subscribedChannels } = useSelector(
    (state) => state.user
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [filterData, setFilterData] = useState("");
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      <header className="bg-[#0f0f0f]  text-white  h-15 p-2 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between p-2 sm:p-0 ">
          {/* {left} */}
          <div className="flex items-center gap-4 px-0 py-0">
            <button
              className="  hidden md:inline-flex btn btn-square btn-ghost px-0 py-0 "
              onClick={() => setSideBarOpen(!sideBarOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-48 stroke-current "
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>{" "}
              </svg>
            </button>
            <div
              onClick={() => {
                navigate("/");
              }}
              className="flex items-center gap-[5px] cursor-pointer"
            >
              <SiYoutubestudio className="text-orange-500 w-7 h-7" />
              <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white">
                PT <span className="text-[#ffffff]">Studio</span>
              </h1>
            </div>
          </div>

          {/* {rigth} */}

          <div className="flex items-center gap-3">
            {userData?.channel && (
              <button
                onClick={() => {
                  navigate("/create");
                }}
                className="hidden md:flex items-center gap-1 bg-gray-[#272727] px-3 py-1 border border-gray-700 rounded-full hover:cursor-pointer text-gray-400 hover:text-white"
              >
                <span className="text-lg">+</span>
                <span>Create</span>
              </button>
            )}
            <div className=" hidden  md:dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn  btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  {!userData?.avatar ? (
                    <FaUserCircle className="w-full h-full" />
                  ) : (
                    <img
                      src={userData.avatar}
                      className="  border-gray-700   "
                    />
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className=" text-black menu menu-sm dropdown-content bg-gray-200 rounded-box z-1 mt-3 w-70 p-2 shadow"
              >
                <div>
                  {userData && (
                    <div className="flex  items-center gap-3 p-4 border-b border-gray-700">
                      <img
                        src={userData?.avatar}
                        alt="profileImage"
                        className="w-12 h-12 flex items-center justify-center rounded-full object-cover border-1 border-gray-700"
                      />
                      <div>
                        <h3 className="font-semibold text-black">
                          {`@${userData?.username}`}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {userData?.email}
                        </p>
                        <p
                          className="text-sm text-blue-700 cursor-pointer hover:underline"
                          onClick={() => {
                            userData?.channel
                              ? navigate("/view-channel")
                              : navigate("/create-channel");
                          }}
                        >
                          {userData?.channel
                            ? "view channel"
                            : "create channel"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <li>
                  <button>
                    <FcGoogle size={20} className="w-5 " />
                    SignIn with Google
                  </button>
                </li>
                {!userData && (
                  <li>
                    <button
                      onClick={() => {
                        navigate("/sign-in");
                      }}
                    >
                      <FiLogIn size={20} className="w-5" />
                      SignIn with Email
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      navigate("/sign-up");
                    }}
                  >
                    <TiUserAddOutline size={20} className="w-5" />
                    Create new Account
                  </button>
                </li>

                {userData && (
                  <li>
                    <button onClick={() => navigate("/sign-in")}>
                      <MdOutlineSwitchAccount size={20} className="w-5" />
                      SignIn with other account
                    </button>
                  </li>
                )}
                {userData?.channel && (
                  <li>
                    <button
                      onClick={() => {
                        navigate("/PT-Studio");
                      }}
                    >
                      <SiYoutubestudio
                        size={20}
                        className="w-5 text-orange-500"
                      />
                      PT Studio
                    </button>
                  </li>
                )}

                {userData && (
                  <li>
                    <button>
                      <FiLogOut size={20} className="w-5" />
                      SignOut
                    </button>
                  </li>
                )}
                <li>
                  <button>
                    <IoSettingsSharp size={20} className="w-5" />
                    Settings
                  </button>
                </li>
              </ul>
            </div>
            <FaSearch
              onClick={() => {
                setSearchPopup(!searchPopup);
              }}
              size={25}
              className="text-lg md:hidden flex mr-5"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col  md:flex-row">
        <aside className="hidden mt-20 md:flex w-56 lg:w-64 bg-[#121212] border-r border-gray-800 flex-col p-4 shadow-lg">
          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <img
              src={channelData?.avatar}
              alt=""
              className="w-28 h-28 rounded-full border
                 border-gray-700 object-cover shadow-md hover:scale-105 transition"
            />
            <h2 className="text-base lg:text-lg font-semibold">
              {channelData?.name}
            </h2>
            <p className="text-xs text-gray-400">Your Channel</p>
          </div>
          <nav className="space-y-2 mt-3">
            <SideBarItems
              icon={<FaTachometerAlt />}
              text={"Dashboard"}
              open={sideBarOpen}
              selected={selectedItem === "Dashboard"}
              onClick={() => {
                setSelectedItem("Dashboard");
                navigate("/PT-studio/dashboard");
              }}
            />
            <SideBarItems
              icon={<FaViadeo />}
              text={"Content"}
              open={sideBarOpen}
              selected={selectedItem === "Content"}
              onClick={() => {
                setSelectedItem("Content");
                navigate("/PT-studio/content");
              }}
            />
            <SideBarItems
              icon={<FaChartBar />}
              text={"Analytics"}
              open={sideBarOpen}
              selected={selectedItem === "Analytics"}
              onClick={() => {
                setSelectedItem("Analytics");
                navigate("/PT-studio/analytics");
              }}
            />
            <SideBarItems
              icon={<RiMoneyCnyCircleFill />}
              text={"Revenue"}
              open={sideBarOpen}
              selected={selectedItem === "Revenue"}
              onClick={() => {
                setSelectedItem("Revenue");
                navigate("/PT-studio/revenue");
              }}
            />
          </nav>
        </aside>

        <main className="flex-1 p-4 mt-10 sm:p-6 pb-20 md:pb-6 ">
          <div className="border border-gray-700 mt-8 rounded-lg p-5 sm:p-6 text-center text-gray-400 bg-[#181818] shadow-inner min-h-[70vh]">
            <div className="mt-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50">
        <MobileSizeNav
          icon={<FaTachometerAlt />}
          text={"Dashboard"}
          active={active === "Dashboard"}
          onClick={() => {
            setActive("Dashboard");
            navigate("/PT-studio/dashboard");
          }}
        />
        <MobileSizeNav
          icon={<FaVideo />}
          text={"Content"}
          active={active === "Content"}
          onClick={() => {
            setActive("Content");
            navigate("/PT-studio/content");
          }}
        />
        <MobileSizeNav
          icon={<IoIosAddCircle size={40} />}
          active={active === "+"}
          onClick={() => {
            setActive("+");
            navigate("/create");
          }}
        />
        <MobileSizeNav
          icon={<FaChartBar />}
          text={"Analytics"}
          active={active === "Analytics"}
          onClick={() => {
            setActive("Analytics");
            navigate("/PT-studio/analytics");
          }}
        />
        <MobileSizeNav
          icon={<RiMoneyCnyCircleFill />}
          text={"Revenue"}
          active={active === "Revenue"}
          onClick={() => {
            setActive("Revenue");
            navigate("/PT-studio/revenue");
          }}
        />
      </nav>
    </div>
  );
};

export default PTStudio;
