import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY } from '../../utils/constants';
import { getUserData } from '../../services/userService';

const initialState = {
  isAuthenticated: false,
  user: null,
};

export const verifyAuthentication = createAsyncThunk(
  'auth/verifyAuthentication',
  async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  }
);

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const data = await getUserData();
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate(state) {
      state.isAuthenticated = true;
    },
    deauthenticate(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUserProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAuthentication.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { authenticate, deauthenticate, updateUserProfile } =
  authSlice.actions;
export default authSlice.reducer;
