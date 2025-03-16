import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./user/userSlice";
import paymentReducer from "./user/paymentSlice";
import reservationReducer from "./user/reservationSlice";
import searchReducer from "./user/searchSlice";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const rootReducer = combineReducers({
  user: persistReducer(persistConfig, userReducer),
  payment: persistReducer(persistConfig, paymentReducer),
  reservation: persistReducer(persistConfig, reservationReducer),
  search: persistReducer(persistConfig, searchReducer),
});

//create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
