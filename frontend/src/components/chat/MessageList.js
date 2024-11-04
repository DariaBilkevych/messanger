import React, { forwardRef, useEffect } from 'react';
import { FlatList } from 'react-native';
import MessageItem from './MessageItem';
import { DateTime } from 'luxon';

const MessageList = forwardRef(({ messages, receiverId }, ref) => {
  const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString, { zone: 'Europe/Kyiv' });
    return date.toFormat('d MMM, HH:mm');
  };

  const renderMessageItem = ({ item }) => {
    const isCurrentUserMessage = item.senderId === receiverId;
    const formattedDate = formatDate(item.createdAt);

    return (
      <MessageItem
        key={item._id}
        message={item.message}
        messageType={item.messageType}
        fileUri={item.src}
        isCurrentUserMessage={isCurrentUserMessage}
        formattedDate={formattedDate}
      />
    );
  };

  return (
    <FlatList
      ref={ref}
      data={messages}
      renderItem={renderMessageItem}
      keyExtractor={(item) => item._id}
      onContentSizeChange={() => {
        setTimeout(() => {
          ref.current.scrollToEnd({ animated: true });
        }, 300);
      }}
    />
  );
});

export default MessageList;
