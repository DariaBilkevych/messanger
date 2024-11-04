import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = ({ receiverName, receiverAvatar }) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View className="flex-row items-center p-2 border-b border-purple-200 mb-5 justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-md font-semibold">{receiverName}</Text>
        </View>
        <View className="flex-row items-center">
          <Image
            source={{ uri: receiverAvatar }}
            className="w-9 h-9 rounded-full mr-2"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatHeader;
