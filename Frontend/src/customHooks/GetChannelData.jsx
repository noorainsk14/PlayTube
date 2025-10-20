import { useEffect, useRef } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setAllChannelData, setChannelData } from "../redux/userSlice";

const GetChannelData = () => {
  const dispatch = useDispatch();
  const { userData, channelData } = useSelector((state) => state.user);
  const fetched = useRef(false); // 👈 track whether we've already fetched

  // 🔹 Fetch the logged-in user's channel
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/channel/get-channel`,
          {
            withCredentials: true,
          }
        );
        dispatch(setChannelData(result.data.data?.channel));
        //console.log("Fetched channel:", result.data.data?.channel);
      } catch (error) {
        // console.log("Error fetching channel:", error);
        dispatch(setChannelData(null));
      }
    };

    if (userData && !channelData && !fetched.current) {
      // ✅ only fetch once per login
      fetched.current = true;
      fetchChannel();
    }

    if (!userData) {
      // ✅ reset on logout
      dispatch(setChannelData(null));
      fetched.current = false;
    }
  }, [userData, channelData, dispatch]);

  // 🔹 Fetch all channels once globally
  useEffect(() => {
    const fetchAllChannel = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/channel/get-allChannel`,
          {
            withCredentials: true,
          }
        );
        dispatch(setAllChannelData(result?.data?.data?.channels));
        //console.log("Fetched all channels:", result?.data?.data?.channels);
      } catch (error) {
        // console.log(
        //   "Error fetching all channels:",
        //   error?.response?.data?.message
        // );
        dispatch(setAllChannelData(null));
      }
    };

    fetchAllChannel();
  }, [dispatch]);
};

export default GetChannelData;
