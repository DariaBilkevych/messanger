import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const UserHeader = ({ user, onLogout }) => (
  <View className="flex-row items-center justify-between mb-4 pt-14">
    <View className="flex-row items-center">
      <Image
        source={{ uri: user.avatar }}
        className="w-8 h-8 rounded-full"
        resizeMode="cover"
      />
      <Text className="ml-3 text-md font-semibold text-purple-950">
        {user.firstName} {user.lastName}
      </Text>
    </View>
    <TouchableOpacity onPress={onLogout}>
      <Feather name="log-out" size={20} color="#FF3E3E" />
    </TouchableOpacity>
  </View>
);

export default UserHeader;
