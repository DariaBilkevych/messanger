import React from 'react';
import { FlatList, TouchableOpacity, Image, Text } from 'react-native';

const UserList = ({ users }) => (
  <FlatList
    data={users}
    keyExtractor={(user) => user._id}
    renderItem={({ item: user }) => (
      <TouchableOpacity className="border-b border-purple-200 py-4 flex-row items-center">
        <Image
          source={{ uri: user.avatar }}
          className="w-10 h-10 rounded-full mr-3"
          resizeMode="cover"
        />
        <Text className="text-lg text-purple-900">
          {user.firstName} {user.lastName}
        </Text>
      </TouchableOpacity>
    )}
    ListEmptyComponent={() => (
      <Text className="text-center text-purple-900">No users found</Text>
    )}
  />
);

export default UserList;
