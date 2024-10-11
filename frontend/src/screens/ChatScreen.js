import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { getMessages } from '../services/chatService';
import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import Loading from '../components/common/Loading';
import { useMessageContext } from '../context/MessageContext';

const ChatScreen = ({ route }) => {
  const { receiverId, receiverName, receiverAvatar } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messageListRef = useRef(null);
  const { updateLastMessage } = useMessageContext();

  const socket = useSelector((state) => state.socket.socket);

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

    if (socket) {
      socket.on('newMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        console.log(newMessage);
        updateLastMessage(newMessage.receiverId, newMessage.message);
      });
    }

    return () => socket?.off('newMessage');
  }, [receiverId, socket, messages, setMessages, updateLastMessage]);

  return (
    <View className="flex-1 bg-white">
      <ChatHeader receiverAvatar={receiverAvatar} receiverName={receiverName} />
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
