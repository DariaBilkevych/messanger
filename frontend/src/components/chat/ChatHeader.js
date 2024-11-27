import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChatHeader = ({
  receiverName,
  receiverAvatar,
  receiverId,
  receiverPhone,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { onlineUsers } = useSelector((state) => state.socket);
  const [isUserOnline, setIsUserOnline] = useState(false);

  useEffect(() => {
    const isOnline = onlineUsers.some((user) => user === receiverId);
    setIsUserOnline(isOnline);
  }, [onlineUsers, receiverId]);

  const handleProfilePress = () => {
    navigation.navigate('UserProfile', {
      receiverName,
      receiverAvatar,
      receiverId,
      receiverPhone,
    });
  };

  return (
    <SafeAreaView style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center p-2 border-b border-purple-200 justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <View View className="items-center">
            <Text className="text-base font-semibold">{receiverName}</Text>
            <Text
              className={`text-xs ${isUserOnline ? ' text-purple-800' : 'text-gray-500'}`}
            >
              {isUserOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={{ uri: receiverAvatar }}
            className="w-9 h-9 rounded-full mr-2"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatHeader;
