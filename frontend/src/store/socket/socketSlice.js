import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
import { getUserData } from '../../services/userService';
import { SOCKET_URL } from '../../utils/constants';

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
    },
    clearSocket(state) {
      console.log('Clearing socket');
      if (state.socket) {
        state.socket.close();
        state.socket = null;
      }
    },
  },
});

export const connectSocket = createAsyncThunk(
  'socket/connect',
  async (_, { dispatch, getState }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) return;

    const userData = await getUserData();
    const userId = userData.id;

    const socketInstance = io(SOCKET_URL, {
      query: { userId },
    });

    dispatch(setSocket(socketInstance));

    socketInstance.on('disconnect', () => {
      dispatch(clearSocket());
    });
  }
);

export const disconnectSocket = () => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.close();
    dispatch(clearSocket());
  }
};

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
