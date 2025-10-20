import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import { setVideoData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";
import { SiShopee } from "react-icons/si";

const UpdateVideo = () => {
  const { videoId } = useParams();
  const { videoData } = useSelector((state) => state.content);
  const { channelData } = useSelector((state) => state.user);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/video/${videoId}/fetch-video`,
          { withCredentials: true }
        );
        //console.log("fetch video :", result.data?.data?.video);
        setVideo(result.data?.data?.video);
        setTitle(result.data?.data?.video?.title);
        setDescription(result.data?.data?.video?.description);
        setTags(result.data?.data?.video?.tags?.join(", "));
      } catch (error) {
        showErrorToast("Failed to load video.");
        console.log(error);
        navigate("/");
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title),
      formData.append("description", description),
      formData.append(
        "tags",
        JSON.stringify(tags.split(",").map((tag) => tag.trim()))
      ),
      formData.append("thumbnail", thumbnail);
    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/video/${videoId}/update-video`,
        formData,
        { withCredentials: true }
      );
      const response = result.data?.data?.video;
      // console.log(response);
      showSuccessToast("Video Updated Successfully");

      //update redux
      const updatedVideo = videoData?.filter((v) =>
        v?._id === videoId ? result.data?.data?.video : v
      );

      navigate("/");
      dispatch(setVideoData(updatedVideo));
    } catch (error) {
      console.log(error);
      showErrorToast(error?.response?.data?.message || "Video Upload error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure, You want to delete this video")) return;

    setLoading1(true);
    try {
      const result = await axios.delete(
        `${serverUrl}/api/v1/video/${videoId}/delete-video`,
        { withCredentials: true }
      );
      //console.log(result);

      //remove from redux
      dispatch(setVideoData(videoData.filter((v) => v._id !== videoId)));

      showErrorToast("Video deleted successfully");
      navigate("/");
    } catch (error) {
      console.log(error?.response);
      showErrorToast(error?.response?.data?.message || "Video delete failed");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex  flex-col pt-5 ">
      <div className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          {/* updateVideo */}

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
            onClick={handleUpdate}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md "></span>
                <span className="text-white animate-pulse">
                  Updating... please wait...
                </span>
              </div>
            ) : (
              "Update Video"
            )}
          </button>

          <button
            onClick={handleDelete}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            disabled={loading1}
          >
            {loading1 ? (
              <div className="flex flex-col justify-center items-center">
                <span className="loading loading-spinner loading-md "></span>
                <span className="text-white animate-pulse">
                  Deleting... please wait...
                </span>
              </div>
            ) : (
              "Delete Video"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateVideo;
