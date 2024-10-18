import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { sendMessage } from '../../services/chatService';
import { updateLastMessage } from '../../store/message/messageSlice';
import Toast from 'react-native-toast-message';
import {
  pickMedia,
  readFileAsBase64,
  resizeImage,
  checkFileSize,
} from '../../utils/fileUtils';

const MessageInput = ({ receiverId }) => {
  const [message, setMessage] = useState('');
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [messageType, setMessageType] = useState('text');
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

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
            senderId: newMessage.senderId._id,
            receiverId,
            message: message,
            messageType: finalMessageType,
          })
        );

        setMessage('');
        setFileData(null);
        setFileName(null);
        setMessageType('text');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not send the message.',
        });
      }
    }
  };

  const pickImage = async () => {
    const result = await pickMedia('image');
    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize;
      if (!checkFileSize(fileSize)) return;

      const manipulatedResult = await resizeImage(result.assets[0].uri);
      const base64Data = await readFileAsBase64(manipulatedResult.uri);

      setFileData(base64Data);
      setFileName(result.assets[0].fileName || 'selected_image.jpg');
      setMessageType('image');
      setModalVisible(true);
    }
  };

  const pickFile = async () => {
    const result = await pickMedia('file');
    if (!result.canceled) {
      const fileSize = result.assets[0].size;
      if (!checkFileSize(fileSize)) return;

      const base64Data = await readFileAsBase64(result.assets[0].uri);

      setFileData(base64Data);
      setFileName(result.assets[0].name);
      setMessageType('file');
      setModalVisible(true);
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
