import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { iconStyles } from './styles';

const SearchInput = ({ searchQuery, setSearchQuery }) => {
  return (
    <View className="flex-row items-center bg-white rounded-full shadow-lg mb-4 px-4 border border-gray-300">
      <Feather name="search" size={iconStyles.size} color={iconStyles.color} />
      <TextInput
        className="flex-1 py-2 px-2 text-purple-800"
        placeholder="Search chats..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
          <AntDesign
            name="closecircleo"
            size={iconStyles.size}
            color={iconStyles.color}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;
