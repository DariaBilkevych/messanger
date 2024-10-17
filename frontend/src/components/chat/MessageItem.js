import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message';

const MessageItem = ({
  message,
  messageType,
  fileData,
  isCurrentUserMessage,
  formattedDate,
}) => {
  const messageContainerStyle = isCurrentUserMessage
    ? 'bg-gray-200 mr-auto'
    : 'bg-purple-800 ml-auto';
  const messageTextStyle = isCurrentUserMessage ? 'text-black' : 'text-white';
  const timestampStyle = isCurrentUserMessage
    ? 'mr-auto text-gray-500'
    : 'ml-auto text-gray-500';

  const handleOpenFile = async () => {
    try {
      const fileUri = `${FileSystem.documentDirectory}file.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, fileData, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error opening file:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not open the file.',
      });
    }
  };

  return (
    <View className="mb-4 px-4">
      <View className={`p-2 rounded-lg ${messageContainerStyle} max-w-[70%]`}>
        {messageType === 'text' ? (
          <Text className={`${messageTextStyle} text-base`}>{message}</Text>
        ) : messageType === 'image' ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${fileData}` }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity onPress={handleOpenFile}>
            <Text className={`${messageTextStyle} text-base underline`}>
              Download File
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <Text className={`${timestampStyle} text-xs mt-1`}>{formattedDate}</Text>
    </View>
  );
};

export default MessageItem;
