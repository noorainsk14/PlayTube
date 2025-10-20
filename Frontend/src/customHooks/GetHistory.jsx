import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { SetShortHistory, SetVideoHistory } from "../redux/userSlice";

const GetHistory = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/channel/get-history`,
          { withCredentials: true }
        );
        //console.log(result?.data?.data?.sortedHistory);
        const history = result?.data?.data?.sortedHistory;
        const Videos = history.filter((v) => v.contentType === "Video");

        const Shorts = history.filter((v) => v.contentType === "Short");

        dispatch(SetVideoHistory(Videos));
        dispatch(SetShortHistory(Shorts));
        //console.log(Videos, Shorts);
      } catch (error) {
        // console.log(error);
        dispatch(SetVideoHistory(null));
        dispatch(SetShortHistory(null));
      }
    };
    fetchHistory();
  }, []);
};

export default GetHistory;
