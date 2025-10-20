import { useState } from "react";
import logo from "../assets/play_13955998.png";
import StepOne from "../components/ForgetPasswordCompo/StepOne";
import StepTwo from "../components/ForgetPasswordCompo/StepTwo";
import StepThree from "../components/ForgetPasswordCompo/StepThree";
import axios from "axios";
import { serverUrl } from "../App";
import { showErrorToast, showSuccessToast } from "../helper/toastHelper";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [conPass, setConPass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/users/send-otp`,
        { email },
        { withCredentials: true }
      );
      //console.log(result);
      setStep(2);
      setLoading(false);
      showSuccessToast(result.data.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      showErrorToast("Check your Email");
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/users/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      // console.log(result);
      setStep(3);
      setLoading(false);
      showSuccessToast(result.data.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      showErrorToast("Otp was not sent. Please retry again!");
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      if (newPass !== conPass) {
        setLoading(false);
        showErrorToast("Password is not matched !");
      }
      const result = await axios.post(
        `${serverUrl}/api/v1/users/reset-password`,
        { email, password: newPass },
        { withCredentials: true }
      );
      //console.log(result);
      setLoading(false);
      showSuccessToast(result.data.data);
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
      showErrorToast("Password was not reset!");
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex flex-col bg-[#202124] text-white">
      <header className="flex items-center gap-2 p-4 border-b border-gray-700">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <span className="text-white font-bold text-xl tracking-tight font-roboto">
          PlayTube
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-4">
        {step === 1 && (
          <StepOne
            email={email}
            setEmail={setEmail}
            loading={loading}
            onClick={handleSendOtp}
          />
        )}

        {step === 2 && (
          <StepTwo
            otp={otp}
            setOtp={setOtp}
            loading={loading}
            onClick={handleVerifyOtp}
          />
        )}

        {step === 3 && (
          <StepThree
            newPass={newPass}
            setNewPass={setNewPass}
            conPass={conPass}
            setConPass={setConPass}
            loading={loading}
            onClick={handleResetPassword}
          />
        )}
      </main>
    </div>
  );
};

export default ForgetPassword;
