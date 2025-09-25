import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../../public/play_13955998.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    // Reset previous error
    setErrorMsg("");

    if (step === 1) {
      if (!fullName || !username || !email) {
        alert("Please fill all the fields");
        return;
      }
    }

    if (step === 2) {
      if (!password || !confirmPassword) {
        alert("Please fill all the fields");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Optional: Check file type and size
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB.");
      return;
    }

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSignUp = async () => {
    if (!backendImage) {
      alert("Please choose profile Image");
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", backendImage);
    formData.append("coverImage", coverImage);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/users/register`,
        formData,
        { withCredentials: true }
      );
      console.log(result);
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex  items-center justify-center min-h-screen bg-[#181818] ">
        {/* {step1} */}
        {step == 1 && (
          <div>
            <fieldset className="fieldset bg-[#202124]  rounded-box w-xs border p-4 shadow-lg">
              <div className="flex items-center mb-6">
                <button
                  className="text-gray-300 mr-3 hover:text-white cursor-pointer"
                  onClick={() => {
                    if (step > 1) {
                      setStep(step - 1);
                    } else {
                      navigate("/");
                    }
                  }}
                >
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
              <input
                type="text"
                className="input"
                placeholder="Joe Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
              />

              <label className="label text-white">Username</label>
              <input
                type="text"
                className="input"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />

              <label className="label text-white">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <button
                className="btn btn-neutral w-30 rounded-full  mt-4 ml-40"
                onClick={handleNext}
              >
                Next
                <MdKeyboardArrowRight size={20} className="" />
              </button>
            </fieldset>
          </div>
        )}

        {/* {setp 2} */}
        {step == 2 && (
          <div>
            <fieldset className="fieldset bg-[#202124]  rounded-box w-xs border p-4 shadow-lg">
              <div className="flex items-center mb-6">
                <button
                  className="text-gray-300 mr-3 hover:text-white cursor-pointer"
                  onClick={() => {
                    if (step > 1) {
                      setStep(step - 1);
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  <FaArrowLeft size={20} />
                </button>
                <span className="text-white text-2xl font-medium">
                  Create Account
                </span>
              </div>
              <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
                <img src={logo} alt="logo" className="w-8 h-8" />
                <span>Security</span>
              </h1>
              <div className="flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-2">
                <FaUserCircle className="text-white mr-2" size={20} />
                {email}
              </div>
              <label className="label text-white">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder=""
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <label className="label text-white">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />

              <label className="label text-white ">
                <input
                  type="checkbox"
                  className="checkbox checkbox-neutral mt-2 bg-white"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
                <span className="mt-2">Show Password</span>
              </label>

              <button
                className="btn btn-neutral w-30 rounded-full  mt-4 ml-40"
                onClick={handleNext}
              >
                Next
                <MdKeyboardArrowRight size={20} className="" />
              </button>
            </fieldset>
          </div>
        )}

        {/* {step 3} */}
        {step == 3 && (
          <div>
            <fieldset className="fieldset bg-[#202124]  rounded-box w-xs border p-4 shadow-lg">
              <div className="flex items-center mb-6">
                <button
                  className="text-gray-300 mr-3 hover:text-white cursor-pointer"
                  onClick={() => {
                    if (step > 1) {
                      setStep(step - 1);
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  <FaArrowLeft size={20} />
                </button>
                <span className="text-white text-2xl font-medium">
                  Create Account
                </span>
              </div>
              <h1 className="text-3xl font-normal text-white mb-2 flex items-center gap-2">
                <img src={logo} alt="logo" className="w-8 h-8" />
                <span>Choose Avatar</span>
              </h1>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex flex-col items-center mt-6 ">
                  <div className="  w-18 h-18 rounded-full border-4 border-gray-500 overflow-hidden shadow-lg ">
                    {frontendImage ? (
                      <img
                        src={frontendImage}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle
                        className="text-gray-300 w-full h-full p-2"
                        size={20}
                      />
                    )}
                  </div>

                  {coverImage && (
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover Preview"
                      className="w-20 h-10 object-cover rounded mt-5  "
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label text-white text-lg ml-5">
                    Avatar Image
                  </label>
                  <input
                    type="file"
                    className="file-input rounded-full w-[230px] "
                    accept="image/*"
                    onChange={handleImage}
                  />

                  <label className="label text-white text-lg ml-5">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    className="file-input rounded-full w-[230px]"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setCoverImage(file);
                    }}
                  />
                </div>
              </div>

              <button
                className="btn btn-neutral w-40 rounded-full mt-4 ml-40"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <span className="flex items-center gap-1">
                    Create Account
                    <MdKeyboardArrowRight size={20} className="" />
                  </span>
                )}
              </button>
            </fieldset>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUp;
