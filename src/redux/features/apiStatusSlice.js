import { createSlice } from "@reduxjs/toolkit";

const apiStatusSlice = createSlice({
  name: "apiStatus",
  initialState: {
    isSuccess: false,
    isFailure: false,
    message: "",
    isOpen: false,
  },
  reducers: {
    onSuccess: (state, { payload: { message } }) => {
      state.isSuccess = true;
      state.isFailure = false;
      state.message = message;
      state.isOpen = true;
    },
    onFailure: (state, { payload: { message } }) => {
      state.isSuccess = false;
      state.isFailure = true;
      state.message = message;
      state.isOpen = true;
    },
    resetStates: (state) => {
      state.isSuccess = false;
      state.isFailure = false;
      state.message = "";
      state.isOpen = false;
    },
  },
});

export const { onSuccess, onFailure, resetStates } = apiStatusSlice.actions;

export default apiStatusSlice.reducer;

export const getApiStatus = (state) => state.apiStatus;
