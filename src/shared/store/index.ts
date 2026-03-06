import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/shared/api/baseApi";
import { tonApi } from "@/shared/api/tonApi";
import { dyorApi } from "@/shared/api/dyorApi";
import { userSlice } from "@/entities/user";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [tonApi.reducerPath]: tonApi.reducer,
    [dyorApi.reducerPath]: dyorApi.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, tonApi.middleware, dyorApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
