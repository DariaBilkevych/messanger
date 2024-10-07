import React from 'react';
import { FlatList } from 'react-native';
import MessageItem from './MessageItem';

const MessageList = ({ messages, receiverId }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formattedDate = date.toLocaleString('en-GB', options);
    return formattedDate.replace(' at', ',');
  };

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => {
        const isCurrentUserMessage = item.senderId === receiverId;
        const formattedDate = formatDate(item.createdAt);

        return (
          <MessageItem
            message={item.message}
            isCurrentUserMessage={isCurrentUserMessage}
            formattedDate={formattedDate}
          />
        );
      }}
      keyExtractor={(item) => item._id}
    />
  );
};

export default MessageList;
