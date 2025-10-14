import { useState } from "react";
import { FaImage } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChannelData } from "../../redux/userSlice";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import axios from "axios";
import { serverUrl } from "../../App";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreatePost = async () => {
    if (!content) {
      showErrorToast("Post content is required !");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("ChannelId", channelData._id);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/post/create-post`,

        formData,

        { withCredentials: true }
      );

      console.log(result.data?.data?.post);
      const updateChannel = {
        ...channelData,
        post: [...(channelData.post || []), result.data?.data?.post],
      };
      dispatch(setChannelData(updateChannel));
      showSuccessToast("Post Created.");
      navigate("/");
    } catch (error) {
      console.log(error);
      showErrorToast(error?.response?.data?.message || "Create post error !!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-[20px] justify-center items-center">
      <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
        <textarea
          type="text"
          className=" w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-28"
          placeholder="Write something for your community..."
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        />

        <label
          htmlFor="image"
          className="flex items-center space-x-3 cursor-pointer"
        >
          <FaImage className="text-2xl text-gray-300" />
          <span className="text-gray-300">Add Image (optional)</span>
          <input
            type="file"
            className="hidden"
            id="image"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </label>
        {image && (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(image)}
              alt="image"
              className="max-h-64 object-cover"
            />
          </div>
        )}
        <button
          onClick={handleCreatePost}
          disabled={!content}
          className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer"
        >
          {loading ? (
            <span className="loading loading-spinner loading-md "></span>
          ) : (
            "Create Post"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
