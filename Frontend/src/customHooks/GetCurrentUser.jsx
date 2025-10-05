import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const GetCurrentUser = () => {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/users/current-user`,
          { withCredentials: true }
        );
        dispatch(setUserData(result.data.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, [dispatch, channelData]);
  return <div></div>;
};

export default GetCurrentUser;
