import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const Loading = () => (
  <View className="flex-1 justify-center items-center bg-purple-40">
    <ActivityIndicator size="large" color="purple-700" />
    <Text className="text-purple-800 font-semibold mt-2">Loading...</Text>
  </View>
);

export default Loading;
