import React, { forwardRef } from 'react';
import { FlatList } from 'react-native';
import MessageItem from './MessageItem';
import moment from 'moment-timezone';

const MessageList = forwardRef(({ messages, receiverId }, ref) => {
  const formatDate = (dateString) => {
    const date = moment(dateString).tz('Europe/Kyiv');

    const formattedDate = date.format('D MMM, HH:mm');
    return formattedDate;
  };

  return (
    <FlatList
      ref={ref}
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
      onContentSizeChange={() => {
        ref.current.scrollToEnd({ animated: true });
      }}
    />
  );
});

export default MessageList;
