import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages } from '../services/chatService';
import { sortUsers } from './messageUtils';

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
