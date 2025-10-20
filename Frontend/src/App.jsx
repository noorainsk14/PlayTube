import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "react-hot-toast";
import Shorts from "./pages/Shorts/Shorts";
import Subscriptions from "./pages/Subscriptions/Subscriptions";
import Playlist from "./pages/Playlist/Playlist";
import History from "./pages/History/History";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./pages/ForgetPassword";
import CreateChannel from "./pages/Channel/createChannel";
import ViewChannel from "./pages/Channel/ViewChannel";
import GetChannelData from "./customHooks/GetChannelData";
import UpdateChannel from "./pages/Channel/UpdateChannel";
import { useSelector } from "react-redux";
import { showErrorToast } from "./helper/toastHelper";
import CreatePage from "./pages/CreatePage";
import CreateVideo from "./pages/Videos/CreateVideo";
import CreateShort from "./pages/Shorts/CreateShort";
import CreatePlaylist from "./pages/Playlist/CreatePlaylist";
import CreatePost from "./pages/Post/CreatePost";
import GetContentData from "./customHooks/GetContentData";
import GetSubscribeData from "./customHooks/GetSubscribeData";
import PlayVideo from "./pages/Videos/PlayVideo";
import PlayShort from "./pages/Shorts/PlayShort";
import ChannelPage from "./pages/Channel/ChannelPage";
import LikeContent from "./pages/LikeContent/LikeContent";
import SaveContent from "./pages/SaveVideos/SaveContent";
import GetHistory from "./customHooks/GetHistory";
import GetRecommendedContent from "./customHooks/GetRecommendedContent";
import PTStudio from "./pages/PtStudio/PTStudio";
import Dashboard from "./components/PTStudioCompo/Dashboard";
import Content from "./components/PTStudioCompo/Content";
import Analytics from "./components/PTStudioCompo/Analytics";
import Revenue from "./components/PTStudioCompo/Revenue";
import UpdateVideo from "./pages/Videos/UpdateVideo";
import UpdateShort from "./pages/Shorts/UpdateShort";
import UpdatePlaylist from "./pages/Playlist/UpdatePlaylist";

export const serverUrl = import.meta.env.VITE_SERVER_URL;

const ProtectRoute = ({ userData, children }) => {
  if (!userData) {
    showErrorToast("Please signUp first to use this feature");
    return <Navigate to={"/"} replace />;
  }
  return children;
};

function App() {
  GetCurrentUser();
  GetChannelData();
  GetContentData();
  GetSubscribeData();
  GetHistory();
  GetRecommendedContent();

  const { userData } = useSelector((state) => state.user);
  function ChannelPageWrapper() {
    const location = useLocation();
    return <ChannelPage key={location.pathname} />;
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          // Default options for all toasts
          className: "bg-neutral text-neutral-content shadow-lg rounded-lg",
          style: {
            padding: "16px",
            fontWeight: "bold",
          },
          // Optionally customize per type
          success: {
            className: "bg-success text-success-content",
          },
          error: {
            className: "bg-error text-error-content",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route
            path="play-short/:shortId"
            element={
              <ProtectRoute userData={userData}>
                <PlayShort />
              </ProtectRoute>
            }
          />
          <Route
            path="subscriptions"
            element={
              <ProtectRoute userData={userData}>
                <Subscriptions />
              </ProtectRoute>
            }
          />
          <Route
            path="history"
            element={
              <ProtectRoute userData={userData}>
                <History />
              </ProtectRoute>
            }
          />
          <Route
            path="saved-playlist"
            element={
              <ProtectRoute userData={userData}>
                <Playlist />
              </ProtectRoute>
            }
          />
          <Route
            path="saved-content"
            element={
              <ProtectRoute userData={userData}>
                <SaveContent />
              </ProtectRoute>
            }
          />
          <Route
            path="liked-content"
            element={
              <ProtectRoute userData={userData}>
                <LikeContent />
              </ProtectRoute>
            }
          />
          <Route path="mobile-profile" element={<MobileProfile />} />
          <Route
            path="view-channel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />

          <Route
            path="update-channel"
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="update"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />
          <Route
            path="create-video"
            element={
              <ProtectRoute userData={userData}>
                <CreateVideo />
              </ProtectRoute>
            }
          />
          <Route
            path="create-short"
            element={
              <ProtectRoute userData={userData}>
                <CreateShort />
              </ProtectRoute>
            }
          />
          <Route
            path="create-playlist"
            element={
              <ProtectRoute userData={userData}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="create-post"
            element={
              <ProtectRoute userData={userData}>
                <CreatePost />
              </ProtectRoute>
            }
          />
          <Route
            path="/play-video/:videoId"
            element={
              <ProtectRoute userData={userData}>
                <PlayVideo />
              </ProtectRoute>
            }
          />
          <Route
            path="create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />
          <Route
            path="channel-page/:id"
            element={
              <ProtectRoute userData={userData}>
                <ChannelPageWrapper />
              </ProtectRoute>
            }
          />
        </Route>

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/create-channel"
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />

        <Route
          path="/PT-studio"
          element={
            <ProtectRoute userData={userData}>
              <PTStudio />
            </ProtectRoute>
          }
        >
          {/* Redirect /PT-studio to /PT-studio/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="content" element={<Content />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="update-video/:videoId" element={<UpdateVideo />} />
          <Route path="update-short/:shortId" element={<UpdateShort />} />
          <Route
            path="update-playlist/:playlistId"
            element={<UpdatePlaylist />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
