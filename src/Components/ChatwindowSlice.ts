// src/features/counter/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";
const ChatSlice = createSlice({
  name: "ChatSlice",
  initialState: {
    id: "",
  },
  reducers: {
    changeId: (state, { payload }) => {
      state.id = payload;
    },
  },
});

export const { changeId } = ChatSlice.actions;
export default ChatSlice.reducer;
