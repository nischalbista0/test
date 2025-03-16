import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchStatus: '',
  error: null,
  loading: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchStart: (state) => {
      state.loading = true;
    },
    searchSuccess: (state, action) => {
      state.searchStatus = action.payload;
      state.loading = false;
      state.error = null;
    },

    searchFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    searchReset: (state) => {
      state.searchStatus = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { searchStart, searchFailure, searchReset, searchSuccess } =
  searchSlice.actions;

export default searchSlice.reducer;
