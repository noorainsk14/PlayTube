import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showErrorToast, showSuccessToast } from "../../helper/toastHelper";
import axios from "axios";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePlaylist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videosData, setVideosData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const { videoData } = useSelector((state) => state.content);

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

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/playlist/${playlistId}/fetch-playlist`,
          { withCredentials: true }
        );
        //console.log("fetch short :", result.data?.data?.playlist);
        setPlaylist(result.data?.data?.playlist);
        setTitle(result.data?.data?.playlist?.title);
        setDescription(result.data?.data?.playlist?.description);
        setSelectedVideos(
          result.data?.data?.playlist?.videos.map((v) => v?._id)
        );
      } catch (error) {
        showErrorToast("Failed to load video.");
        console.log(error);
        navigate("/");
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      //find difference betwwen old playist.vidoes and new selectedVideos
      const currentVideos = playlist.videos.map((v) => v._id.toString());
      const newVideos = selectedVideos.map((v) => v.toString());

      const addVideos = newVideos.filter((id) => !currentVideos.includes(id));
      const removeVideos = currentVideos.filter(
        (id) => !newVideos.includes(id)
      );

      const result = await axios.post(
        `${serverUrl}/api/v1/playlist/${playlistId}/update-playlist`,
        {
          title,
          description,
          addVideos,
          removeVideos,
        },
        { withCredentials: true }
      );
      const response = result.data?.data?.playlist;
      //console.log(response);
      showSuccessToast("Playlist Updated Successfully");

      //update redux
      const updatedPlaylist = channelData?.playlist?.map((s) =>
        s?._id === playlistId ? result.data?.data?.playlist : s
      );

      dispatch(setChannelData(updatedPlaylist));
      navigate("/");
    } catch (error) {
      console.log(error);
      showErrorToast(error?.response?.data?.message || "Playlist Upload error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure, You want to delete this Playlist"))
      return;

    setLoading1(true);
    try {
      const result = await axios.delete(
        `${serverUrl}/api/v1/playlist/${playlistId}/delete-playlist`,
        { withCredentials: true }
      );
      //console.log(result);

      //remove from redux

      const updatedchannel = {
        ...channelData,
        playlist: channelData.playlist.filter((s) => s._id === playlistId),
      };
      dispatch(setChannelData(updatedchannel));
      showErrorToast("Playlist deleted successfully");
      navigate("/PT-studio/content");
    } catch (error) {
      console.log(error?.response);
      showErrorToast(error?.response?.data?.message || "Short delete failed");
    } finally {
      setLoading1(false);
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
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <span className="loading loading-spinner loading-md "></span>
            ) : (
              "Update Playlist"
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading1}
            className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer"
          >
            {loading1 ? (
              <span className="loading loading-spinner loading-md "></span>
            ) : (
              "Delete Playlist"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default UpdatePlaylist;
