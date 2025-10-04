import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import axios from "axios";
import { serverUrl } from "../../App";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import StepThree from "../../components/CreateChannelCompo/StepThree";
import StepTwo from "../../components/CreateChannelCompo/StepTwo";
import StepOne from "../../components/CreateChannelCompo/StepOne";

const UpdateChannel = () => {
  const { channelData } = useSelector((state) => state.user);
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [channelName, setChannelName] = useState(channelData?.name);
  const [description, setDescription] = useState(channelData?.description);
  const [category, setCategory] = useState(channelData?.category);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (channelData) {
      setChannelName(channelData.name || "");
      setDescription(channelData.description || "");
      setCategory(channelData.category || "");
    }
  }, [channelData]);

  const handleAvatar = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleCoverImage = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleUpdateChannel = async () => {
    const formData = new FormData();
    formData.append("name", channelName);
    formData.append("description", description);
    formData.append("category", category);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    setLoading(true);

    try {
      const result = await axios.patch(
        `${serverUrl}/api/v1/channel/update-channel`,
        formData,
        { withCredentials: true }
      );

      showSuccessToast(result.data?.message || "Channel updated successfully!");
      navigate("/view-channel");
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || "Something went wrong";
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg">
          {step === 1 && (
            <StepOne
              text={channelData ? channelData?.name : "Channel Name"}
              avatar={avatar}
              setAvatar={setAvatar}
              channelName={channelName}
              setChannelName={setChannelName}
              headline={"Customize Your channel"}
              onChange={handleAvatar}
              onClick={nextStep}
              existingAvatarUrl={channelData?.avatar}
            />
          )}

          {step === 2 && (
            <StepTwo
              avatar={avatar}
              setAvatar={setAvatar}
              channelName={channelName}
              setChannelName={setChannelName}
              headline={"Your Updated Channel"}
              onChange={handleAvatar}
              button={"Continue and update Channel"}
              onClick={nextStep}
              prevStep={prevStep}
              existingAvatarUrl={channelData?.avatar}
            />
          )}

          {step === 3 && (
            <StepThree
              text={"Customize Channel"}
              coverImage={coverImage}
              channelName={channelName}
              description={description}
              setDescription={setDescription}
              category={category}
              setCategory={setCategory}
              loading={loading}
              setLoading={setLoading}
              onChange={handleCoverImage}
              onClick={handleUpdateChannel}
              buttonText={"Customize Channel"}
              prevStep={prevStep}
              existingCoverImageUrl={channelData?.coverImage}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default UpdateChannel;
