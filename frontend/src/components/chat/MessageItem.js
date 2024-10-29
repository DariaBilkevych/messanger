import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';

const MessageItem = ({
  message,
  messageType,
  fileData,
  isCurrentUserMessage,
  formattedDate,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const messageContainerStyle = isCurrentUserMessage
    ? 'bg-gray-200 mr-auto'
    : 'bg-purple-800 ml-auto';
  const messageTextStyle = isCurrentUserMessage ? 'text-black' : 'text-white';
  const timestampStyle = isCurrentUserMessage
    ? 'mr-auto text-gray-500'
    : 'ml-auto text-gray-500';

  const handleOpenFile = async () => {
    try {
      // Вказуємо шлях для тимчасового файлу
      const fileUri = `${FileSystem.cacheDirectory}file.pdf`;

      // Зберігаємо base64 як файл
      await FileSystem.writeAsStringAsync(fileUri, fileData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log(fileUri);
      // Відкриваємо PDF-файл у браузері
      await WebBrowser.openBrowserAsync(fileUri);
    } catch (error) {
      console.error('Error opening file:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not open the file.',
      });
    }
  };

  const handleImagePress = () => {
    setModalVisible(true);
  };

  return (
    <View className="mb-4 px-4">
      <View className={`p-2 rounded-lg ${messageContainerStyle} max-w-[70%]`}>
        {messageType === 'text' ? (
          <Text className={`${messageTextStyle} text-base`}>{message}</Text>
        ) : messageType === 'image' ? (
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${fileData}` }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleOpenFile}>
            <Text className={`${messageTextStyle} text-base underline`}>
              Preview File
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text className={`${timestampStyle} text-xs mt-1`}>{formattedDate}</Text>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black">
            <TouchableOpacity
              className="absolute top-10 right-2 p-2"
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
            <Image
              source={{ uri: `data:image/jpeg;base64,${fileData}` }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MessageItem;
