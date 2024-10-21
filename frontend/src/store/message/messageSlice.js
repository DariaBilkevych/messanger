import { createSlice } from '@reduxjs/toolkit';
import { fetchLastMessages } from '../../utils/messageThunks';
import { sortUsers } from '../../utils/messageUtils';

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    usersWithLastMessages: [],
    loading: false,
  },
  reducers: {
    updateLastMessage: (state, action) => {
      const { senderId, receiverId, message, messageType } = action.payload;

      state.usersWithLastMessages = state.usersWithLastMessages.map((user) => {
        if (user._id === senderId || user._id === receiverId) {
          return {
            ...user,
            lastMessage: formatMessageByType(message, messageType),
            lastMessageDate: new Date().toISOString(),
          };
        }
        return user;
      });

      state.usersWithLastMessages = sortUsers(state.usersWithLastMessages);
    },
    addUserWithLastMessage: (state, action) => {
      const newUser = action.payload;
      const userExists = state.usersWithLastMessages.find(
        (user) => user._id === newUser._id
      );

      if (!userExists) {
        state.usersWithLastMessages.push({
          ...newUser,
          lastMessage: newUser.lastMessage || 'No messages here',
          lastMessageDate: new Date().toISOString() || null,
        });
      }

      state.usersWithLastMessages = sortUsers(state.usersWithLastMessages);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLastMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLastMessages.fulfilled, (state, action) => {
        state.usersWithLastMessages = sortUsers(action.payload);
        state.loading = false;
      })
      .addCase(fetchLastMessages.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updateLastMessage, addUserWithLastMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
