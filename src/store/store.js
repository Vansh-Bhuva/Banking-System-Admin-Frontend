import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/adminAuth/adminAuthSlice";

export const store = configureStore({
  reducer: { adminAuth: adminAuthReducer },
});