import React from 'react';
import { View, Text, Image, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UserProfileScreen = ({ route }) => {
  const { receiverName, receiverAvatar, receiverPhone } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-gray-100"
    >
      <View className="p-4 bg-white rounded-lg shadow-md mx-4 mt-4 mb-8">
        <Image
          source={{ uri: receiverAvatar }}
          className="w-32 h-32 rounded-full mb-4 self-center"
        />
        <Text className="text-3xl font-semibold text-center text-gray-800">
          {receiverName}
        </Text>
        <Text className="text-xl text-center text-gray-600 mt-2">
          {receiverPhone}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
