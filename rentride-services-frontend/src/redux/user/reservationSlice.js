import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reservationStatus: '',
  error: null,
  loading: false,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    reservationStart: (state) => {
      state.loading = true;
    },
    reservationSuccess: (state, action) => {
      state.reservationStatus = action.payload;
      state.loading = false;
      state.error = null;
    },
    reservationFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    reservationReset: (state) => {
      state.reservationStatus = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  reservationStart,
  reservationFailure,
  reservationSuccess,
  reservationReset,
} = reservationSlice.actions;

export default reservationSlice.reducer;
