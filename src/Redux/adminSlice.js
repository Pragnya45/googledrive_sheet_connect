import { createSlice } from "@reduxjs/toolkit";
import { adminLogoutFn } from "./logoutSlice";

const initialState = {
  token: "",
  fileId: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminFn: (state, action) => {
      for (let key in state) {
        if (action.payload.hasOwnProperty(key)) {
          state[key] = action.payload[key];
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(adminLogoutFn, (state) => {
      return { ...initialState };
    });
  },
});

const adminReducer = adminSlice.reducer;
const adminState = (state) => state.admin;
const { adminFn } = adminSlice.actions;

export { adminReducer, adminState, adminFn };
