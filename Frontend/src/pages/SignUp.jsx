import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showErrorToast, showSuccessToast } from "../helper/toastHelper";
import { isValidEmail, isValidPassword } from "../helper/validation";
import StepOne from "../components/SignUpCompo/StepOne";
import StepTwo from "../components/SignUpCompo/StepTwo";
import StepThree from "../components/SignUpCompo/StepThree";

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
    setErrorMsg("");

    if (step === 1) {
      if (!fullName || !username || !email) {
        showErrorToast("Please fill all the fields!");
        return;
      }

      if (!isValidEmail(email)) {
        showErrorToast("Please enter a valid email address!");
        return;
      }
    }

    if (step === 2) {
      if (!password || !confirmPassword) {
        showErrorToast("Please fill all the fields!");
        return;
      }

      if (!isValidPassword(password)) {
        showErrorToast("Password must be at least 6 characters long!");
        return;
      }

      if (password !== confirmPassword) {
        showErrorToast("Passwords do not match!");
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
      showErrorToast("Please select a valid image file!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showErrorToast("Image size should be less than 2MB!");
      return;
    }

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSignUp = async () => {
    if (!backendImage) {
      showErrorToast("Please choose profile image!");
    }

    if (!isValidEmail(email)) {
      showErrorToast("Invalid email format.");
      return;
    }

    if (!isValidPassword(password)) {
      showErrorToast("Password must be at least 6 characters.");
      return;
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
      showSuccessToast("SignUp Successfull !");
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
      <div className="flex  gap-20 items-center justify-center min-h-screen bg-[#181818] ">
        {/* {step1} */}

        {step === 1 && (
          <StepOne
            fullName={fullName}
            setFullName={setFullName}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            onNext={handleNext}
            step={step}
            setStep={setStep}
          />
        )}

        {/* {setp 2} */}
        {step === 2 && (
          <StepTwo
            email={email}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onNext={handleNext}
            step={step}
            setStep={setStep}
          />
        )}

        {/* {step 3} */}
        {step === 3 && (
          <StepThree
            frontendImage={frontendImage}
            handleImage={handleImage}
            backendImage={backendImage}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            loading={loading}
            onSubmit={handleSignUp}
            step={step}
            setStep={setStep}
          />
        )}
      </div>
    </>
  );
};

export default SignUp;
