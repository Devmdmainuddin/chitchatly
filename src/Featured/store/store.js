
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/Userslice"; // import the reducer
import activeReducer from "../slices/activeSlice"; // import the reducer

export default configureStore({
  reducer: {
    user: userReducer, // Pass the reducer, not the slice
    activeChat: activeReducer, 
  },
});
