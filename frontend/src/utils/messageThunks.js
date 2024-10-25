import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages } from '../services/chatService';
import { sortUsers, formatMessageByType } from './messageUtils';

export const fetchLastMessages = createAsyncThunk(
  'messages/fetchLastMessages',
  async (users) => {
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const messages = await getMessages(user._id);

        let lastMessage = messages[messages.length - 1] ?? {
          message: 'No messages here',
          createdAt: null,
          messageType: 'text',
        };

        lastMessage.message = formatMessageByType(
          lastMessage.message,
          lastMessage.messageType
        );

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
