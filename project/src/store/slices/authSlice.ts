import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Service {
  id: string;
  name: 'spotify' | 'soundcloud' | 'deezer';
  connected: boolean;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  services: Service[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    connectService: (state, action: PayloadAction<Service>) => {
      if (state.user) {
        const serviceIndex = state.user.services.findIndex(
          (s) => s.id === action.payload.id
        );
        
        if (serviceIndex >= 0) {
          state.user.services[serviceIndex] = action.payload;
        } else {
          state.user.services.push(action.payload);
        }
        
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    disconnectService: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const serviceIndex = state.user.services.findIndex(
          (s) => s.id === action.payload
        );
        
        if (serviceIndex >= 0) {
          state.user.services[serviceIndex].connected = false;
          state.user.services[serviceIndex].token = undefined;
          state.user.services[serviceIndex].refreshToken = undefined;
          state.user.services[serviceIndex].expiresAt = undefined;
        }
        
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { 
  setUser, 
  logout, 
  setLoading, 
  setError,
  connectService,
  disconnectService
} = authSlice.actions;

export default authSlice.reducer;