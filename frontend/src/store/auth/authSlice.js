import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY } from '../../utils/constants';

const initialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate(state) {
      state.isAuthenticated = true;
    },
    deauthenticate(state) {
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyAuthentication.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload;
    });
  },
});

export const verifyAuthentication = createAsyncThunk(
  'auth/verifyAuthentication',
  async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    return !!token;
  }
);

export const { authenticate, deauthenticate } = authSlice.actions;
export default authSlice.reducer;
