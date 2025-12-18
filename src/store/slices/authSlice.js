import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
  isAuthenticated: !!storedUser,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = {
        _id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
        profilePic: action.payload.profilePic,
        role: action.payload.role,
        token: action.payload.token, 
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");

    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, loading } = authSlice.actions;
export default authSlice.reducer;
