import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setChannelData, setUserData } from "../redux/userSlice";

const GetChannelData = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/channel/get-channel`,
          { withCredentials: true }
        );
        dispatch(setChannelData(result.data.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
        dispatch(setChannelData(null));
      }
    };
    fetchChannel();
  }, [dispatch]);
};

export default GetChannelData;
