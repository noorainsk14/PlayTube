import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import { setVideoData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";

const CreateVideo = () => {
  const { videoData } = useSelector((state) => state.content);
  const { channelData } = useSelector((state) => state.user);
  const [videoUrl, setVideoUrl] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVideo = (e) => {
    setVideoUrl(e.target.files[0]);
  };
  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title),
      formData.append("description", description),
      formData.append(
        "tags",
        JSON.stringify(tags.split(",").map((tag) => tag.trim()))
      ),
      formData.append("video", videoUrl),
      formData.append("thumbnail", thumbnail),
      formData.append("channelId", channelData._id);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/video/upload-video`,
        formData,
        { withCredentials: true }
      );
      const response = result.data.data.newVideo;
      // console.log(response);
      showSuccessToast("Video Uploaded Successfully");
      navigate("/");
      dispatch(setVideoData([...videoData, response]));
      const updateChannel = {
        ...channelData,
        videos: [...(channelData.videos || []), response],
      };
      dispatch(setChannelData(updateChannel));
    } catch (error) {
      console.log(error.response);
      showErrorToast(error.response.data.message || "Video Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex  flex-col pt-5 ">
      <div className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* uploadVideo */}

          <label
            htmlFor="video"
            className="cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-1 hover:border-orange-500 transition"
          >
            <input
              type="file"
              id="video"
              placeholder="Choose file:*"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              accept="video/*"
              onChange={handleVideo}
            />
          </label>

          <input
            type="text"
            id="video"
            placeholder="Title*"
            value={title || ""}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />

          <textarea
            name="description"
            id="description"
            placeholder="Description*"
            value={description || ""}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          <input
            type="text"
            id="tags"
            placeholder="Tags*"
            value={tags || ""}
            className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onChange={(e) => {
              setTags(e.target.value);
            }}
          />

          {/* uploadThumbnail */}

          <label htmlFor="thumbnail" className="block cursor-pointer">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                className="w-full  rounded-lg border border-gray-700 mb-2 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2">
                Click to upload thumbnail
              </div>
            )}
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              className="hidden"
              accept="image/*"
              onChange={handleThumbnail}
            />
          </label>
          <button
            onClick={handleUpload}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            disabled={!title || !description || !tags}
          >
            {loading ? (
              <div className="flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md "></span>
                <span className="text-white animate-pulse">
                  Uploading... please wait...
                </span>
              </div>
            ) : (
              "Upload Video"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateVideo;
