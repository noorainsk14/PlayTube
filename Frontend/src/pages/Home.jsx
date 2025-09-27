import logo from "../assets/play_13955998.png";
import SideBarItems from "../components/SideBarItems";
import MobileSizeNav from "../components/MobileSizeNav";
import { useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { GoVideo } from "react-icons/go";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { Outlet } from "react-router-dom";
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

const Home = () => {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

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
  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {/* {navbar} */}
      <header className="bg-[#0f0f0f] h-15 p-3 pb-4  border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
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
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1">
              <input
                type="text"
                className="flex-1 bg-[#1b1b1b] px-4 py-2 rounded-l-full outline-none border border-gray-700"
                placeholder="Search"
              />
              <button className="bg-[#272727] px-4 rounded-r-full border border-gray-700">
                <FaSearch />
              </button>
            </div>
            <button className="bg-[#272727] p-3 rounded-full">
              <FaMicrophone />
            </button>
          </div>

          {/* {rigth} */}

          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-1 bg-gray-[#272727] px-3 py-1 border border-gray-700 rounded-full hover:cursor-pointer">
              <span className="text-lg">+</span>
              <span className="text-white">Create</span>
            </button>
            <div className=" hidden md:dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <FaUserCircle className="w-full h-full" />
                </div>
              </div>
              <ul
                tabIndex={0}
                className=" text-black menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <button className="justify-between">
                    Profile
                    <span className="badge bg-gray-200">New</span>
                  </button>
                </li>
                <li>
                  <button>Settings</button>
                </li>
                <li>
                  <button>Logout</button>
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
            onClick={() => setSelectedItem("Home")}
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
            onClick={() => setSelectedItem("Subscriptions")}
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
            onClick={() => setSelectedItem("History")}
          />
          <SideBarItems
            icon={<FaList />}
            text={"Playlist"}
            open={sideBarOpen}
            selected={selectedItem === "Playlist"}
            onClick={() => setSelectedItem("Playlist")}
          />
          <SideBarItems
            icon={<GoVideo />}
            text={"Save Videos"}
            open={sideBarOpen}
            selected={selectedItem === "Save Videos"}
            onClick={() => setSelectedItem("Save Videos")}
          />
          <SideBarItems
            icon={<FaThumbsUp />}
            text={"Like Videos"}
            open={sideBarOpen}
            selected={selectedItem === "Like Videos"}
            onClick={() => setSelectedItem("Like Videos")}
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
          onClick={() => setActive("Home")}
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
          onClick={() => setActive("+")}
        />
        <MobileSizeNav
          icon={<MdOutlineSubscriptions />}
          text={"Subscriptions"}
          active={active === "Subscriptions"}
          onClick={() => setActive("Subscriptions")}
        />
        <MobileSizeNav
          icon={<FaUserCircle />}
          text={"You"}
          active={active === "You"}
          onClick={() => setActive("You")}
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
