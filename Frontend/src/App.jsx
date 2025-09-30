import { Route, Routes } from "react-router-dom";
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

export const serverUrl = "http://localhost:8080";

function App() {
  GetCurrentUser();
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
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/history" element={<History />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/save-videos" element={<SaveVideos />} />
          <Route path="/like-videos" element={<LikeVideos />} />
          <Route path="/mobile-profile" element={<MobileProfile />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </>
  );
}

export default App;
