import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import axios from "axios";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const CreatePlaylist = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videosData, setVideosData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState("");
  const [loading, setLoading] = useState(false);
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (channelData || channelData.videos) {
      setVideosData(channelData.videos);
    }
  }, []);

  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleCreatePlaylist = async () => {
    if (selectedVideos.length === 0) {
      showErrorToast("Please select at least one video");
      return;
    }
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/v1/playlist/create-playlist`,
        {
          title,
          description,
          channelId: channelData._id,
          videoIds: selectedVideos,
        },
        { withCredentials: true }
      );

      //console.log(result.data?.data?.playlist);
      const updateChannel = {
        ...channelData,
        playlists: [
          ...(channelData.playlist || []),
          result.data?.data?.playlist,
        ],
      };
      dispatch(setChannelData(updateChannel));
      showSuccessToast("Playlist Created.");
      navigate("/");
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message || "Create playlist error !!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-10 ">
      <main className="flex flex-1 justify-center items-start px-4 py-6">
        <div className="bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          <input
            type="text"
            className=" w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
          />
          <textarea
            type="text"
            className=" w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            placeholder="Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
          />

          <div>
            <p className="mb-3 text-lg font-semibold ">Select Videos</p>
            {videosData?.length === 0 ? (
              <p className="text-sm text-gray-400">
                No videos found for this channel
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {videosData?.map((video) => (
                  <div
                    key={video._id}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedVideos.includes(video._id)
                        ? "border-orange-500"
                        : "border-gray-700"
                    }`}
                    onClick={() => toggleVideoSelect(video._id)}
                  >
                    <img
                      src={video?.thumbnail}
                      alt="video"
                      className="w-full h-28 object-cover"
                    />
                    <p className="p-2 text-sm truncate">{video?.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleCreatePlaylist}
            disabled={!title || !description}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <span className="loading loading-spinner loading-md "></span>
            ) : (
              "Create Playlist"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;
