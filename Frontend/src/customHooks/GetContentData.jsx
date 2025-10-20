import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setVideoData } from "../redux/contentSlice.js";
import { setShortData } from "../redux/contentSlice.js";

const GetContentData = () => {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/v1/video/get-videos`, {
          withCredentials: true,
        });
        dispatch(setVideoData(result.data?.data?.videos));
      } catch (error) {
        //console.log(error.response?.data?.message);
        dispatch(setVideoData(null));
      }
    };
    fetchVideos();
  }, [dispatch, channelData]);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/v1/short/get-shorts`, {
          withCredentials: true,
        });
        //console.log(result?.data?.data?.shorts);
        dispatch(setShortData(result.data?.data?.shorts));
      } catch (error) {
        //console.log(error.response?.data?.message);
        dispatch(setShortData(null));
      }
    };
    fetchShorts();
  }, [dispatch, channelData]);
};

export default GetContentData;
