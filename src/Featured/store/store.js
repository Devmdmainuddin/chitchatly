import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "../slices/Userslice";
import { activeSlice } from "../slices/activeSlice";
export default configureStore({
  reducer: {
    userLoginInfo: UserSlice,
    activeChat: activeSlice,
  },
});