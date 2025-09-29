import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showErrorToast, showSuccessToast } from "../helper/toastHelper";
import { isValidPassword } from "../helper/validation";
import StepOne from "../components/SignInCompo/StepOne";
import StepTwo from "../components/SignInCompo/StepTwo";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleNext = () => {
    if (step == 1) {
      if (!identifier.trim()) {
        showErrorToast("Please fill the username or email.");
        return;
      }

      if (isEmail(identifier.trim())) {
        setEmail(identifier.trim());
      } else {
        setEmail("");
      }
    }

    if (step === 2) {
      if (!password) {
        showErrorToast("Please fill the password!");
        return;
      }
      if (password.length < 6) {
        showErrorToast("Password must be at least 6 characters!");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!password) {
      showErrorToast("Please fill the password!");
      setLoading(false);
      return;
    }

    if (!isValidPassword(password)) {
      showErrorToast("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: isEmail(identifier) ? "" : identifier,
        email: isEmail(identifier) ? identifier : "",
        password,
      };

      const result = await axios.post(
        `${serverUrl}/api/v1/users/login`,
        payload,
        {
          withCredentials: true,
        }
      );
      console.log(result.data.data);

      dispatch(setUserData(result.data.data));
      showSuccessToast("Login successful! ");
      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        showErrorToast(err.response.data.message);
      } else {
        showErrorToast("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false); // ← Make sure this always runs
    }
  };
  return (
    <div className="flex  gap-20 items-center justify-center min-h-screen bg-[#181818] ">
      {step == 1 && (
        <StepOne
          identifier={identifier}
          setIdentifier={setIdentifier}
          onNext={handleNext}
          step={step}
          setStep={setStep}
        />
      )}
      {step == 2 && (
        <StepTwo
          email={email || identifier}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loading={loading}
          onSubmit={handleSubmit}
          step={step}
          setStep={setStep}
        />
      )}
    </div>
  );
};

export default SignIn;
