import { configureStore } from "@reduxjs/toolkit";
import { rtkQApi } from "./rtkQApi";
import apiStatusSlice from "./features/apiStatusSlice";

const store = configureStore({
  reducer: {
    [rtkQApi.reducerPath]: rtkQApi.reducer,
    apiStatus: apiStatusSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkQApi.middleware),
});

export default store;
