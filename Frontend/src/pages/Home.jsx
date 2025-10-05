import logo from "../assets/play_13955998.png";
import SideBarItems from "../components/SideBarItems";
import MobileSizeNav from "../components/MobileSizeNav";
import { useState } from "react";
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
import { showErrorToast, showSuccessToast } from "../helper/toastHelper";
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
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase.js";

const Home = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  const categories = [
    "Music",
    "Gaming",
    "Movies",
    "TV Shows",
    "News",
    "Trending",
    "Entertainment",
    "Education",
    "Science & Tech",
    "Travel",
    "Fashion",
    "Cooking",
    "Sports",
    "Pets",
    "Art",
    "Comedy",
    "Vlogs",
  ];

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
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {/* {navbar} */}
      <header className="bg-[#0f0f0f] h-15 p-2 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-[5px]">
              <img src={logo} alt="logo" className="w-10" />
              <span className="text-white font-bold text-xl tracking-tight font-robto">
                PlayTube
              </span>
            </div>
          </div>

          {/* {search} */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl ">
            <div className="flex flex-1">
              <input
                type="text"
                className="flex-1 bg-[#1b1b1b] px-4 py-2 rounded-l-full outline-none border border-gray-700"
                placeholder="Search"
              />
              <button className="bg-[#272727] px-4 rounded-r-full border border-gray-700 hover:cursor-pointer text-gray-400 hover:text-white ">
                <FaSearch />
              </button>
            </div>
            <button className="bg-[#272727] p-3 rounded-full hover:cursor-pointer   text-gray-400 hover:text-white">
              <FaMicrophone />
            </button>
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
                  <button onClick={handleGoogleAuth}>
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
                    <button>
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
                    <button onClick={handleSignOut}>
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
            <FaSearch size={25} className="text-lg md:hidden flex mr-5" />
          </div>
        </div>
      </header>

      {/* {sideBar} */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-[60px] bottom-0 z-40 ${
          sideBarOpen ? "w-60" : "w-20"
        } hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="space-y-1 mt-3">
          <SideBarItems
            icon={<FaHome />}
            text={"Home"}
            open={sideBarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />
          <SideBarItems
            icon={<SiYoutubeshorts />}
            text={"Shorts"}
            open={sideBarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SideBarItems
            icon={<MdOutlineSubscriptions />}
            text={"Subscriptions"}
            open={sideBarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscriptions");
            }}
          />
        </nav>
        <hr className="border-gray-800 my-3" />
        {sideBarOpen && <p className="text-sm text-gray-400 px-2">You</p>}
        <nav className="space-y-1 mt-3">
          <SideBarItems
            icon={<FaHistory />}
            text={"History"}
            open={sideBarOpen}
            selected={selectedItem === "History"}
            onClick={() => {
              setSelectedItem("History");
              navigate("/history");
            }}
          />
          <SideBarItems
            icon={<FaList />}
            text={"Playlist"}
            open={sideBarOpen}
            selected={selectedItem === "Playlist"}
            onClick={() => {
              setSelectedItem("Playlist");
              navigate("/playlist");
            }}
          />
          <SideBarItems
            icon={<GoVideo />}
            text={"Save Videos"}
            open={sideBarOpen}
            selected={selectedItem === "Save Videos"}
            onClick={() => {
              setSelectedItem("Save Videos");
              navigate("/save-videos");
            }}
          />
          <SideBarItems
            icon={<FaThumbsUp />}
            text={"Like Videos"}
            open={sideBarOpen}
            selected={selectedItem === "Like Videos"}
            onClick={() => {
              setSelectedItem("Like Videos");
              navigate("like-videos");
            }}
          />
        </nav>
        <hr className="border-gray-800 my-3" />
        {sideBarOpen && (
          <p className="text-sm text-gray-400 px-2">Subscriptions</p>
        )}
      </aside>

      {/* {bottomNav} */}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-10">
        <MobileSizeNav
          icon={<FaHome />}
          text={"Home"}
          active={active === "Home"}
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        />
        <MobileSizeNav
          icon={<SiYoutubeshorts />}
          text={"Shorts"}
          active={active === "Shorts"}
          onClick={() => setActive("Shorts")}
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
          icon={<MdOutlineSubscriptions />}
          text={"Subscriptions"}
          active={active === "Subscriptions"}
          onClick={() => setActive("Subscriptions")}
        />
        <MobileSizeNav
          icon={
            !userData?.avatar ? (
              <FaUserCircle />
            ) : (
              <img
                src={userData?.avatar}
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            )
          }
          text={"You"}
          active={active === "You"}
          onClick={() => {
            setActive("You");
            navigate("/mobile-profile");
          }}
        />
      </nav>

      {/* Main Area */}
      <main
        className={`overflow-auto p-4 flex flex-col pb-16 transition-all duration-300 ${
          sideBarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >
        {location.pathname === "/" && (
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap pt-2 mt-[60px] mb-9 custom-scrollbar pb-2 ">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className="bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700 whitespace-nowrap hover:cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Home;
