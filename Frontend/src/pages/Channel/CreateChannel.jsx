import { useState } from "react";
import logo from "../../assets/play_13955998.png";
import { useDispatch, useSelector } from "react-redux";
import StepOne from "../../components/CreateChannelCompo/StepOne";
import StepTwo from "../../components/CreateChannelCompo/StepTwo";
import StepThree from "../../components/CreateChannelCompo/StepThree";
import axios from "axios";
import { serverUrl } from "../../App";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import { useNavigate } from "react-router-dom";
import { setChannelData } from "../../redux/userSlice";

const CreateChannel = () => {
  const { userData } = useSelector((state) => state.user);
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAvatar = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleCoverImage = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleCreateChannel = async () => {
    const formData = new FormData();
    formData.append("name", channelName);
    formData.append("description", description);
    formData.append("category", category);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/channel/create-channel`,
        formData,
        { withCredentials: true }
      );
      //console.log(result);
      setLoading(false);
      showSuccessToast(result.data?.message || "Channel created successfully!");
      dispatch(setChannelData(result.data?.data));
      navigate("/view-channel");
    } catch (error) {
      console.log(error);
      dispatch(setChannelData(null));
      setLoading(false);

      const message = error?.response?.data?.message || "Something went wrong";

      showErrorToast(message);
    }
  };

  return (
    <div className=" min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="flex justify-between items-center px-6 py-3 border-b border-gray-800">
        <div onClick={() => navigate("/")} className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-8 h-8 object-cover" />
          <span className="text-white font-bold text-xl tracking-tight font-roboto">
            PlayTube
          </span>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={userData?.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full"
          />
        </div>
      </header>

      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg">
          {step === 1 && (
            <StepOne
              avatar={avatar}
              setAvatar={setAvatar}
              channelName={channelName}
              setChannelName={setChannelName}
              headline={"How you'll appear"}
              onChange={handleAvatar}
              onClick={nextStep}
            />
          )}

          {step === 2 && (
            <StepTwo
              avatar={avatar}
              setAvatar={setAvatar}
              channelName={channelName}
              setChannelName={setChannelName}
              headline={"Your Channel"}
              onChange={handleAvatar}
              button={"Continue and Create Channel"}
              onClick={nextStep}
              prevStep={prevStep}
            />
          )}

          {step === 3 && (
            <StepThree
              text={"Create Channel"}
              coverImage={coverImage}
              channelName={channelName}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              loading={loading}
              setLoading={setLoading}
              onChange={handleCoverImage}
              buttonText={"Create Channel"}
              onClick={handleCreateChannel}
              prevStep={prevStep}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateChannel;
