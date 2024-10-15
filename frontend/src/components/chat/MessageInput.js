import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { sendMessage } from '../../services/chatService';
import { updateLastMessage } from '../../store/message/messageSlice';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'; // Імпортуємо FileSystem

const MessageInput = ({ receiverId }) => {
  const [message, setMessage] = useState('');
  const [fileData, setFileData] = useState(null);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setFileData(base64Data);
    } else {
      console.log('Image picking was canceled.');
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });

    console.log('Document picker result:', result);

    if (result.type === 'success') {
      const base64Data = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setFileData(base64Data);
    } else {
      console.log('File picking was canceled.');
    }
  };

  const handleSend = async () => {
    if (message.trim() || fileData) {
      try {
        const messageType = fileData
          ? fileData.startsWith('data:image')
            ? 'image'
            : 'file'
          : 'text';
        const newMessage = await sendMessage(
          receiverId,
          message,
          messageType,
          fileData
        );
        console.log('New message data:', {
          senderId,
          receiverId,
          message: messageType === 'text' ? message : null,
          messageType,
          fileData: messageType !== 'text' ? fileData : null,
        });

        dispatch(
          updateLastMessage({
            senderId: newMessage.senderId,
            receiverId,
            message: fileData ? 'Sent a file or image' : message,
          })
        );
        setMessage('');
        setFileData(null);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleAttachPress = () => {
    Alert.alert(
      'Choose File Source',
      'Select a source to pick a file',
      [
        { text: 'Gallery', onPress: pickImage },
        { text: 'File Storage', onPress: pickFile },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-row items-center py-5 px-2 mb-5 border-t border-purple-200 bg-white">
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-lg p-2"
      />
      <TouchableOpacity onPress={handleAttachPress} className="ml-2">
        <Ionicons name="attach" size={24} color="#553C9A" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSend} className="ml-2">
        <Ionicons name="send" size={24} color="#553C9A" />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;
