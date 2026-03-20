import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    uid: string;
    email: string | null;
  } | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null } as AuthState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string; email: string | null }>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export const selectUser = (state: any) => state.auth.user;
export default authSlice.reducer;