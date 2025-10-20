import axios from "axios";
import React from "react";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import { setShortData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";

const CreateShort = () => {
  const { channelData } = useSelector((state) => state.user);
  const { shortData } = useSelector((state) => state.content);
  const [shortUrl, setShortUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpload = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );
    formData.append("short", shortUrl);
    formData.append("channelId", channelData._id);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/short/upload-short`,
        formData,
        {
          withCredentials: true,
        }
      );
      //console.log(result.data.data);
      showSuccessToast("Short uploaded successfully !!");
      dispatch(setShortData([...shortData, result.data.data]));
      const updateChannel = {
        ...channelData,
        shorts: [...(channelData.shorts || []), result.data.data],
      };
      dispatch(setChannelData(updateChannel));
    } catch (error) {
      console.log(error.response.data.message);
      showErrorToast(error.response.data.message || "Short Upload error !!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 ">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="p-6 bg-[#212121] rounded-xl w-full max-w-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* left side */}
          <div className="flex justify-center items-start">
            <label
              htmlFor="short"
              className="flex flex-col items-center justify-center border-2 border-dashed hover:border-orange-400 border-gray-500 rounded-lg cursor-pointer bg-[#181818] overflow-hidden w-[220px] aspect-[9/16] "
            >
              {shortUrl ? (
                <video
                  src={URL.createObjectURL(shortUrl)}
                  className="h-full w-full object-cover"
                  controls
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1">
                  <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-300 text-xs text-center px-2">
                    Click to upload short video
                  </p>
                  <span className="text-[10px] text-gray-500">
                    MP4 or MOV - Max 60s
                  </span>
                </div>
              )}
              <input
                type="file"
                id="short"
                onChange={(e) => {
                  setShortUrl(e.target.files[0]);
                }}
                className="hidden"
                accept="video/mp4, video/quicktime"
              />
            </label>
          </div>

          {/* right side  */}

          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Title*"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />

            <textarea
              type="text"
              placeholder="Description*"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />

            <input
              type="text"
              placeholder="Tags* (comma separated)"
              className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={tags}
              onChange={(e) => {
                setTags(e.target.value);
              }}
            />

            <button
              onClick={handleUpload}
              disabled={!title || !description || !tags}
              className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex flex-col justify-center items-center">
                  <span className="loading loading-spinner loading-md "></span>
                  <span className="text-white animate-pulse">
                    Uploading... please wait...
                  </span>
                </div>
              ) : (
                "Upload Short"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateShort;
