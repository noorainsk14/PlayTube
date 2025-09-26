import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "react-hot-toast";
import ChangePassword from "./pages/ChangePassword";

export const serverUrl = "http://localhost:8080";

function App() {
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
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </>
  );
}

export default App;
