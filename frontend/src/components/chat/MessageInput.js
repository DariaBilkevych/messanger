import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { sendMessage } from '../../services/chatService';
import { updateLastMessage } from '../../store/message/messageSlice';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const MessageInput = ({ receiverId }) => {
  const [message, setMessage] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [messageType, setMessageType] = useState('text');
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize;
      const maxSize = 5 * 1024 * 1024;

      if (fileSize > maxSize) {
        Alert.alert('File size exceeds the limit of 5 MB.');
        return;
      }

      const uri = result.assets[0].uri;
      const manipulatedResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64Data = await FileSystem.readAsStringAsync(
        manipulatedResult.uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      setFileData(base64Data);
      setFileName(result.assets[0].filename || 'selected_image.jpg');
      setMessageType('image');
      setModalVisible(true);
    } else {
      console.log('Image picking was canceled.');
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;

      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setFileData(base64Data);
      setFileName(fileName);
      setMessageType('file');
      e;
      setModalVisible(true);
    } else {
      console.log('File picking was canceled.');
    }
  };

  const handleSend = async () => {
    if (message.trim() || fileData) {
      try {
        const finalMessageType = fileData ? messageType : 'text';

        const newMessage = await sendMessage(
          receiverId,
          message,
          finalMessageType,
          fileData
        );

        dispatch(
          updateLastMessage({
            senderId: newMessage.senderId,
            receiverId,
            message: fileData ? 'Sent a file' : message,
          })
        );

        setMessage('');
        setFileData(null);
        setFileName(null);
        setMessageType('text');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleConfirmSend = () => {
    handleSend();
    setModalVisible(false);
  };

  return (
    <View className="flex-row items-center py-5 px-2 mb-5 border-t border-purple-200 bg-white">
      <TouchableOpacity onPress={pickImage} className="mr-2">
        <Ionicons name="image" size={24} color="#553C9A" />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickFile} className="mr-2">
        <Ionicons name="attach" size={24} color="#553C9A" />
      </TouchableOpacity>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-lg p-2"
      />
      <TouchableOpacity onPress={handleSend} className="ml-2">
        <Ionicons name="send" size={24} color="#553C9A" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
          <View className="bg-white p-6 rounded-lg shadow-md w-4/5">
            <Text className="text-xl font-bold mb-2">Confirm Send</Text>
            <Text className="text-lg">
              Do you want to send this file/image?
            </Text>
            <Text className="mt-2 text-gray-700">{fileName}</Text>
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="mr-2"
              >
                <Text className="text-red-500 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmSend}>
                <Text className="text-blue-500 font-semibold">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MessageInput;
