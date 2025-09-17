import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface onLoginPayload {
  loggedInUser: string;
  error: string | null;
}

interface AuthState {
  isUserLoggedIn: boolean;
  user: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isUserLoggedIn: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<onLoginPayload>) => {
      state.isUserLoggedIn = true;
      state.user = action.payload.loggedInUser;
      state.error = action.payload.error;
    },
    setIsLogout: (state) => {
      state.isUserLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const { setIsLogin, setIsLogout } = authSlice.actions;
export default authSlice.reducer;
