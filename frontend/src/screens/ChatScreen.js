import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { getMessages } from '../services/chatService';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import Loading from '../components/common/Loading';

const ChatScreen = ({ route }) => {
  const { receiverId, receiverName, receiverAvatar, receiverPhone } =
    route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messageListRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(receiverId);
        setMessages(data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId, messages, setMessages]);

  return (
    <View className="flex-1 bg-white">
      <ChatHeader
        receiverAvatar={receiverAvatar}
        receiverName={receiverName}
        receiverPhone={receiverPhone}
        receiverId={receiverId}
      />
      {loading ? (
        <Loading />
      ) : messages.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">No messages here</Text>
        </View>
      ) : (
        <MessageList
          messages={messages}
          receiverId={receiverId}
          ref={messageListRef}
        />
      )}
      <MessageInput receiverId={receiverId} />
    </View>
  );
};

export default ChatScreen;
