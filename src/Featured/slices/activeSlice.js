import { createSlice } from "@reduxjs/toolkit";

export const activeSlice = createSlice({
  name: "activeChat",
  initialState: {
    activeChatId: null,
  },
  reducers: {
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
}
});


export const { activeChatId } = activeSlice.actions;

export default activeSlice.reducer;
