import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { pickMedia, resizeImage, checkFileSize } from '../../utils/fileUtils';
import { sendMessage } from '../../services/chatService';
import { updateLastMessage } from '../../store/message/messageSlice';
import { useDispatch } from 'react-redux';

const MessageInput = ({ receiverId }) => {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [messageType, setMessageType] = useState('text');
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const handleSend = async () => {
    if (isSending) return;

    if (message.trim() || fileUri) {
      setIsSending(true);

      try {
        const finalMessageType = fileUri ? messageType : 'text';

        let fileObject = null;
        if (finalMessageType === 'image' && fileUri) {
          fileObject = {
            uri: fileUri,
            name: fileName || 'image.jpg',
            type: 'image/jpeg',
          };
        } else if (finalMessageType === 'file' && fileUri) {
          fileObject = {
            uri: fileUri,
            name: fileName || 'file.txt',
            type: 'application/octet-stream',
          };
        }

        if (finalMessageType !== 'text') {
          setUploading(true);
          Toast.show({
            type: 'info',
            text1: 'Uploading...',
          });
        }

        const newMessage = await sendMessage(
          receiverId,
          message,
          finalMessageType,
          fileObject
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
        setFileUri(null);
        setFileName(null);
        setMessageType('text');
        setInputHeight(40);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Try another one, please.',
          text2: error.message,
        });
      } finally {
        setIsSending(false);
        setUploading(false);
      }
    }
  };

  const pickImage = async () => {
    const result = await pickMedia('image');
    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize;
      if (!checkFileSize(fileSize)) return;

      const resizedImage = await resizeImage(result.assets[0].uri);

      setFileUri(resizedImage.uri);
      setFileName(result.assets[0].fileName || 'selected_image.jpg');
      setMessageType('image');

      setTimeout(() => {
        setModalVisible(true);
      }, 500);
    }
  };

  const pickFile = async () => {
    const result = await pickMedia('file');
    if (!result.canceled) {
      const fileSize = result.assets[0].size;
      if (!checkFileSize(fileSize)) return;

      setFileUri(result.assets[0].uri);
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
        multiline={true}
        textAlignVertical="top"
        scrollEnabled={inputHeight >= 120}
        onContentSizeChange={(e) => {
          setInputHeight(
            e.nativeEvent.contentSize.height > 120
              ? 120
              : e.nativeEvent.contentSize.height
          );
        }}
        className="flex-1 border border-gray-300 rounded-lg p-2"
        style={{ height: inputHeight, maxHeight: 120 }}
      />
      <TouchableOpacity
        onPress={handleSend}
        className="ml-2"
        disabled={isSending}
        style={{ opacity: isSending ? 0.5 : 1 }}
      >
        <Ionicons
          name="send"
          size={24}
          color={isSending ? '#D3D3D3' : '#553C9A'}
        />
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
