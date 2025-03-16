import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentStatus: '',
  error: null,
  loading: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    paymentStart: (state) => {
      state.loading = true;
    },
    paymentSuccess: (state) => {
      state.paymentStatus = "success";
      state.loading = false;
      state.error = null;
    },

    paymentFailure: (state) => {
      state.error = "failure";
      state.loading = false;
    },
    paymentReset: (state) => {
      state.paymentStatus = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { paymentStart, payementFailure, paymentSuccess, paymentReset } =
  paymentSlice.actions;

export default paymentSlice.reducer;
