import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "react-hot-toast";
import ChangePassword from "./pages/ChangePassword";
import Shorts from "./pages/Shorts/Shorts";
import Subscriptions from "./pages/Subscriptions/Subscriptions";
import Playlist from "./pages/Playlist/Playlist";
import SaveVideos from "./pages/SaveVideos/SaveVideos";
import LikeVideos from "./pages/LikeVideos/LikeVideos";
import History from "./pages/History/History";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgetPassword from "./pages/ForgetPassword";
import CreateChannel from "./pages/Channel/createChannel";
import ViewChannel from "./pages/Channel/ViewChannel";
import GetChannelData from "./customHooks/GetChannelData";
import UpdateChannel from "./pages/Channel/UpdateChannel";
import { useSelector } from "react-redux";
import { Children } from "react";
import { showErrorToast } from "./helper/toastHelper";
import CreatePage from "./pages/CreatePage";

export const serverUrl = "http://localhost:8080";

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

  const { userData } = useSelector((state) => state.user);
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
            path="/shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route
            path="/history"
            element={
              <ProtectRoute userData={userData}>
                <History />
              </ProtectRoute>
            }
          />
          <Route
            path="/playlist"
            element={
              <ProtectRoute userData={userData}>
                <Playlist />
              </ProtectRoute>
            }
          />
          <Route
            path="/save-videos"
            element={
              <ProtectRoute userData={userData}>
                <SaveVideos />
              </ProtectRoute>
            }
          />
          <Route
            path="/like-videos"
            element={
              <ProtectRoute userData={userData}>
                <LikeVideos />
              </ProtectRoute>
            }
          />
          <Route
            path="/mobile-profile"
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />
          <Route
            path="/view-channel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/update-channel"
            element={
              <ProtectRoute userData={userData}>
                <UpdateChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/create-channel"
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
