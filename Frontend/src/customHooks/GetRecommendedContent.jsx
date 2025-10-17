import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { SetRecommendedContent } from "../redux/userSlice";

const GetRecommendedContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecommendedContent = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/v1/users/recommendation`,
          { withCredentials: true }
        );
        dispatch(SetRecommendedContent(result.data?.data));
        console.log("✅ Recommended content:", result.data?.data);
      } catch (error) {
        console.error("❌ Error fetching recommendations:", error);
        dispatch(SetRecommendedContent(null)); // ✅ dispatch instead of direct call
      }
    };

    fetchRecommendedContent();
  }, [dispatch]);
};

export default GetRecommendedContent;
