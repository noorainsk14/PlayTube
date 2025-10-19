import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import { setShortData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";

const UpdateShort = () => {
  const { shortId } = useParams();
  const { channelData } = useSelector((state) => state.user);
  const { shortData } = useSelector((state) => state.content);
  const [short, setShort] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/short/${shortId}/fetch-short`,
          { withCredentials: true }
        );
        console.log("fetch short :", result.data?.data?.short);
        setShort(result.data?.data?.short);
        setTitle(result.data?.data?.short?.title);
        setDescription(result.data?.data?.short?.description);
        setTags(result.data?.data?.short?.tags?.join(", "));
      } catch (error) {
        showErrorToast("Failed to load video.");
        console.log(error);
        navigate("/");
      }
    };

    fetchVideo();
  }, [shortId]);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/short/${shortId}/update-short`,
        {
          title,
          description,
          tags: JSON.stringify(
            tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          ),
        },
        { withCredentials: true }
      );
      const response = result.data?.data?.short;
      console.log(response);
      showSuccessToast("Short Updated Successfully");

      //update redux
      const updatedShort = shortData?.map((s) =>
        s?._id === shortId ? result.data?.data?.short : s
      );

      navigate("/");
      dispatch(setShortData(updatedShort));
      const updatedchannel = {
        ...channelData,
        shorts: channelData.shorts.map((s) =>
          s._id === shortId ? updatedShort : s
        ),
      };
      dispatch(setChannelData(updatedchannel));
    } catch (error) {
      console.log(error);
      showErrorToast(error?.response?.data?.message || "Short Upload error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure, You want to delete this short")) return;

    setLoading1(true);
    try {
      const result = await axios.delete(
        `${serverUrl}/api/v1/short/${shortId}/delete-short`,
        { withCredentials: true }
      );
      console.log(result);

      //remove from redux
      dispatch(setShortData(shortData.filter((s) => s._id !== shortId)));

      const updatedchannel = {
        ...channelData,
        shorts: channelData.shorts.filter((s) => s._id === shortId),
      };
      dispatch(setChannelData(updatedchannel));
      showErrorToast("Short deleted successfully");
      navigate("/PT-studio/content");
    } catch (error) {
      console.log(error?.response);
      showErrorToast(error?.response?.data?.message || "Short delete failed");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 ">
      <main className="flex flex-1 justify-center items-center px-4 py-6">
        <div className="p-6 bg-[#212121] rounded-xl w-full max-w-xl shadow-lg flex   flex-col items-center justify-center gap-6">
          <div className="flex flex-col space-y-4 w-full">
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
              onClick={handleUpdate}
              disabled={!title || !description || !tags || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex flex-col justify-center items-center">
                  <span className="loading loading-spinner loading-md "></span>
                  <span className="text-white animate-pulse">
                    Updating... please wait...
                  </span>
                </div>
              ) : (
                "Update Short"
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={!title || !description || !tags || loading1}
              className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center"
            >
              {loading1 ? (
                <div className="flex flex-col justify-center items-center">
                  <span className="loading loading-spinner loading-md "></span>
                  <span className="text-white animate-pulse">
                    Deleting... please wait...
                  </span>
                </div>
              ) : (
                "Delete Short"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateShort;
