import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import socketReducer from './socket/socketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

store.subscribe(() => {
  console.log('Current state:', store.getState());
});
