import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAuthService from "./adminAuthService";

const saved = JSON.parse(localStorage.getItem("adminAuth"));

const initialState = {
  admin: saved || null,
  isLoading: false,
  isError: false,
  message: "",
};

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async (credentials, thunkAPI) => {
    try {
      return await adminAuthService.login(credentials);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLogout: (state) => {
      adminAuthService.logout();
      state.admin = null;
    },
    clearAdminAuthState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { adminLogout, clearAdminAuthState } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;