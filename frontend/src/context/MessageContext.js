import React, { createContext, useContext, useState } from 'react';
import { getMessages } from '../services/chatService';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [usersWithLastMessages, setUsersWithLastMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLastMessages = async (users) => {
    setLoading(true);
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const messages = await getMessages(user._id);
        const lastMessage =
          messages.length > 0
            ? messages[messages.length - 1]
            : { message: 'No messages here', createdAt: null };

        return {
          ...user,
          lastMessage: lastMessage.message,
          lastMessageDate: lastMessage.createdAt,
        };
      })
    );
    setUsersWithLastMessages(updatedUsers);
    setLoading(false);
  };

  const updateLastMessage = (userId, message) => {
    setUsersWithLastMessages((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? { ...user, lastMessage: message, lastMessageDate: new Date() }
          : user
      )
    );
  };

  return (
    <MessageContext.Provider
      value={{
        usersWithLastMessages,
        fetchLastMessages,
        updateLastMessage,
        loading,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
