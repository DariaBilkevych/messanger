import React from 'react';
import { View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchInput = ({ searchQuery, setSearchQuery }) => {
  return (
    <View className="flex-row items-center bg-white rounded-full shadow-lg mb-4 px-4 border border-gray-300">
      <Feather name="search" size={20} color="#6B46C1" />
      <TextInput
        className="flex-1 py-2 px-2 text-purple-800"
        placeholder="Search chats..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

export default SearchInput;
