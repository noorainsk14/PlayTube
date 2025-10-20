import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: storedUser,
    channelData: null,
    allChannelData:null,
    subscribedChannels:null,
    subscribedVideos:null,
    subscribedShorts:null,
    subscribedPlaylists:null,
    subscribedPosts:null,
    videoHistory:null,
    shortHistory:null,
    recommendedContent:null

  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;

      // 🔥 Save to localStorage
      if (action.payload) {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("userData");
      }
    },
    logoutUser: (state) => {
  state.userData = null;
  state.channelData = null;
  state.allChannelData = null;
  state.subscribedChannels = null;
  state.subscribedVideos = null;
  state.subscribedShorts = null;
  state.subscribedPlaylists = null;
  state.subscribedPosts = null;
  state.videoHistory = null;
  state.shortHistory = null;
  state.recommendedContent = null;

  localStorage.removeItem("userData");
},

    setChannelData: (state, action) => {
      state.channelData = action.payload;
    },
    setAllChannelData: (state, action) => {
      state.allChannelData = action.payload;
    },
    setSubscribedChannels: (state, action) => {
      state.subscribedChannels = action.payload;
    },
    setSubscribedVideos: (state, action) => {
      state.subscribedVideos = action.payload;
    },
    setSubscribedShorts: (state, action) => {
      state.subscribedShorts = action.payload;
    },
    setSubscribedPlaylists: (state, action) => {
      state.subscribedPlaylists = action.payload;
    },
    setSubscribedPosts: (state, action) => {
      state.subscribedPosts = action.payload;
    },
    SetVideoHistory: (state, action) => {
      state.videoHistory = action.payload;
    },
    SetShortHistory: (state, action) => {
      state.shortHistory = action.payload;
    },
    SetRecommendedContent: (state, action) => {
      state.recommendedContent = action.payload
    }
  },
});

export const { setUserData,logoutUser, setChannelData,setAllChannelData,setSubscribedChannels,setSubscribedVideos,setSubscribedShorts,setSubscribedPlaylists,setSubscribedPosts,SetVideoHistory,SetShortHistory,SetRecommendedContent } = userSlice.actions;

export default userSlice.reducer;
