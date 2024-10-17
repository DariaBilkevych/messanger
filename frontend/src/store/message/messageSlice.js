import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages } from '../../services/chatService';

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    usersWithLastMessages: [],
    loading: false,
  },
  reducers: {
    updateLastMessage: (state, action) => {
      const { senderId, receiverId, message } = action.payload;

      state.usersWithLastMessages = state.usersWithLastMessages.map((user) => {
        if (user._id === senderId || user._id === receiverId) {
          return {
            ...user,
            lastMessage: message,
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

export const fetchLastMessages = createAsyncThunk(
  'messages/fetchLastMessages',
  async (users) => {
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const messages = await getMessages(user._id);
        const lastMessage = messages[messages.length - 1] ?? {
          message: 'No messages here',
          createdAt: null,
        };

        return {
          ...user,
          lastMessage: lastMessage.message,
          lastMessageDate: lastMessage.createdAt,
        };
      })
    );

    return sortUsers(updatedUsers);
  }
);

const sortUsers = (users) => {
  return users.sort((a, b) => {
    if (!a.lastMessageDate && !b.lastMessageDate) {
      return a.firstName.localeCompare(b.firstName);
    }
    if (!a.lastMessageDate) return 1;
    if (!b.lastMessageDate) return -1;
    return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
  });
};

export const { updateLastMessage, addUserWithLastMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
