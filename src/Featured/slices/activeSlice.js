import { createSlice } from "@reduxjs/toolkit";

export const activeSlice = createSlice({
  name: "activeChat",
  initialState: {
    active: localStorage.getItem("single")
      ? JSON.parse(localStorage.getItem("single"))
      : null,
   
  },
  reducers: {
    activeChat: (state, action) => {
      state.active = action.payload;
    },
}
});


export const { activeChat } = activeSlice.actions;

export default activeSlice.reducer;
