import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import {
  setAllChannelData,
  setChannelData,
  setUserData,
} from "../redux/userSlice";

const GetChannelData = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/channel/get-channel`,
          { withCredentials: true }
        );
        dispatch(setChannelData(result.data.data?.channel));
        console.log(result.data.data?.channel);
      } catch (error) {
        console.log(error);
        dispatch(setChannelData(null));
      }
    };
    fetchChannel();
  }, [dispatch]);

  useEffect(() => {
    const fetchAllChannel = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/channel/get-allChannel`,
          { withCredentials: true }
        );
        dispatch(setAllChannelData(result?.data?.data?.channels));
        console.log(result?.data?.data?.channels);
      } catch (error) {
        console.log(error?.response?.data?.message);
        dispatch(setAllChannelData(null));
      }
    };
    fetchAllChannel();
  }, [dispatch]);
};

export default GetChannelData;
