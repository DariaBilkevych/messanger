import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import socketReducer from './socket/socketSlice';
import messageReducer from './message/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
