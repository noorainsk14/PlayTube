import { useState } from "react";
import logo from "../assets/play_13955998.png";
import StepOne from "../components/ForgetPasswordCompo/StepOne";
import StepTwo from "../components/ForgetPasswordCompo/StepTwo";
import StepThree from "../components/ForgetPasswordCompo/StepThree";

const ForgetPassword = () => {
  const [step, setStep] = useState(3);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [conPass, setConPass] = useState("");

  const handleNext = () => {};

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
          <StepOne email={email} setEmail={setEmail} onClick={handleNext} />
        )}

        {step === 2 && (
          <StepTwo otp={otp} setOtp={setOtp} onClick={handleNext} />
        )}

        {step === 3 && (
          <StepThree
            newPass={newPass}
            setNewPass={setNewPass}
            conPass={conPass}
            setConPass={setConPass}
            onClick={handleNext}
          />
        )}
      </main>
    </div>
  );
};

export default ForgetPassword;
