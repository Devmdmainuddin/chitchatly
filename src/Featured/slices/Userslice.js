import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: localStorage.getItem("users")? JSON.parse(localStorage.getItem("users")): null,
  },
  reducers: {
    userLoginInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { userLoginInfo } = UserSlice.actions;

export default UserSlice.reducer;
