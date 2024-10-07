import React from 'react';
import { View, Text } from 'react-native';

const MessageItem = ({ message, isCurrentUserMessage, formattedDate }) => {
  return (
    <View className="mb-4 px-4">
      <View
        className={`p-2 rounded-lg ${
          isCurrentUserMessage
            ? 'bg-gray-200 mr-auto '
            : 'bg-purple-800 ml-auto'
        }`}
      >
        <Text
          className={`${
            isCurrentUserMessage ? 'text-black' : 'text-white'
          } text-base`}
        >
          {message}
        </Text>
      </View>
      <Text
        className={`${
          isCurrentUserMessage
            ? 'mr-auto text-gray-500'
            : 'ml-auto text-gray-500'
        } text-xs mt-1`}
      >
        {formattedDate}
      </Text>
    </View>
  );
};

export default MessageItem;
