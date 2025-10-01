import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const GetCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(setUserData(null));
        return;
      }
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/users/current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        dispatch(setUserData(result.data.data));
        console.log(result.data.data);
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    fetchUser();
  }, []);

  return <div></div>;
};

export default GetCurrentUser;
