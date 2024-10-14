import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { sendMessage } from '../../services/chatService';
import { updateLastMessage } from '../../store/message/messageSlice';

const MessageInput = ({ receiverId }) => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSend = async () => {
    if (message.trim()) {
      try {
        const newMessage = await sendMessage(receiverId, message);
        dispatch(
          updateLastMessage({
            senderId: newMessage.senderId,
            receiverId,
            message,
          })
        );
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <View className="flex-row items-center py-5 px-2 mb-5 border-t border-purple-200 bg-white">
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-lg p-2"
      />
      <TouchableOpacity onPress={handleSend} className="ml-2">
        <Ionicons name="send" size={24} color="#553C9A" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
