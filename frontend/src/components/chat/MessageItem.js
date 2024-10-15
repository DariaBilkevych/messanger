import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';

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
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `data:application/octet-stream;base64,${fileData}`
              )
            }
          >
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
