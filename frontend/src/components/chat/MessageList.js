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
        message={item.message}
        messageType={item.messageType}
        fileData={item.fileData}
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
        ref.current.scrollToEnd({ animated: true });
      }}
    />
  );
});

export default MessageList;
