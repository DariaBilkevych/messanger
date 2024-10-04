import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getMessages } from '../services/chatService';

const ChatScreen = ({ route }) => {
  const { receiverId } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(receiverId);
        setMessages(data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    fetchMessages();
  }, [receiverId]);

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">
        Chat with User ID: {receiverId}
      </Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-2 rounded-lg mb-2">
            <Text className="text-black">{item.message}</Text>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ChatScreen;
