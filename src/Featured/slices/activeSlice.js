import { createSlice } from "@reduxjs/toolkit";

export const activeSlice = createSlice({
  name: "activeChat",
  initialState: {
    active: localStorage.getItem('active')? JSON.parse(localStorage.getItem('active')): null,
  },
  reducers: {
    activeChat: (state, action) => {
      state.active = action.payload;
    },
  },
});


export const { activeChat } = activeSlice.actions;

export default activeSlice.reducer;
