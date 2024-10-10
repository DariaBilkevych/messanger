import React from 'react';
import { View, Text } from 'react-native';

const MessageItem = ({ message, isCurrentUserMessage, formattedDate }) => {
  const messageContainerStyle = isCurrentUserMessage
    ? 'bg-gray-200 mr-auto'
    : 'bg-purple-800 ml-auto';
  const messageTextStyle = isCurrentUserMessage ? 'text-black' : 'text-white';
  const timestampStyle = isCurrentUserMessage
    ? 'mr-auto text-gray-500'
    : 'ml-auto text-gray-500';

  return (
    <View className="mb-4 px-4">
      <View className={`p-2 rounded-lg ${messageContainerStyle} max-w-[70%]`}>
        <Text className={`${messageTextStyle} text-base`}>{message}</Text>
      </View>
      <Text className={`${timestampStyle} text-xs mt-1`}>{formattedDate}</Text>
    </View>
  );
};

export default MessageItem;
