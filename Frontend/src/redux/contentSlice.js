import { createSlice } from "@reduxjs/toolkit";

const contentSlice = createSlice({
  name: "content",
  initialState: {
    videoData: null,
    shortData: null,
  },

  reducers: {
    setVideoData: (state, action) => {
      state.videoData = action.payload;
    },
    setShortData: (state, action) => {
      state.shortData = action.payload;
    },
  },
});

export const { setVideoData, setShortData } = contentSlice.actions;

export default contentSlice.reducer;
