import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "@/entities/user/model/slice";
import { contactSlice } from "@/entities/contact/model/slice";
import { settingsSlice } from "@/entities/settings/model/slice";
import { tonApi } from "@/shared/api/tonApi";
import { dyorApi } from "@/shared/api/dyorApi";
import { coinGeckoApi } from "@/shared/api/coinGeckoApi";

export const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,
    [contactSlice.name]: contactSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [tonApi.reducerPath]: tonApi.reducer,
    [dyorApi.reducerPath]: dyorApi.reducer,
    [coinGeckoApi.reducerPath]: coinGeckoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tonApi.middleware)
      .concat(dyorApi.middleware)
      .concat(coinGeckoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
