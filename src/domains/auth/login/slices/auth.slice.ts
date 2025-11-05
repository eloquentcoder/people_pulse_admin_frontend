import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../apis/login.api';
import type { User } from '@/common/models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Helper functions for localStorage
const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!(getStoredToken() && getStoredUser()),
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Store token and user in localStorage
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear token and user from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
  },
  extraReducers: (builder) => {
    // Listen to RTK Query login mutation
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        
        // Store token and user in localStorage
        localStorage.setItem('auth_token', action.payload.data.token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.data.user));
      }
    );

    // Listen to RTK Query logout mutation
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        
        // Clear token and user from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    );
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

