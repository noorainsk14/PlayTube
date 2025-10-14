import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import {
  setSubscribedChannels,
  setSubscribedPlaylists,
  setSubscribedPosts,
  setSubscribedShorts,
  setSubscribedVideos,
  setUserData,
} from "../redux/userSlice";

const GetSubscribeData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSubscribed = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/channel/subscribed-data`,
          { withCredentials: true }
        );
        dispatch(setSubscribedChannels(result.data?.data?.SubscribedChannels));
        dispatch(setSubscribedVideos(result.data?.data?.videos));
        dispatch(setSubscribedShorts(result.data?.data?.shorts));
        dispatch(setSubscribedPlaylists(result.data?.data?.playlist));
        dispatch(setSubscribedPosts(result.data?.data?.Post));
        console.log(result.data?.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSubscribed();
  }, []);
};

export default GetSubscribeData;
