import { FlatList, TouchableOpacity, Image, Text, View } from 'react-native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';

const UserList = ({ users, onUserPress, searchQuery }) => {
  const { usersWithLastMessages } = useSelector((state) => state.messages);
  const { onlineUsers } = useSelector((state) => state.socket);

  const truncateMessage = (message, maxLength) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  };

  const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.toFormat('d MMM');
  };

  useEffect(() => {
    console.log(onlineUsers);
    isUserOnline();
  }, [onlineUsers]);

  const isUserOnline = (userId) => {
    const user = onlineUsers.find((user) => user._id === userId);
    return user ? user.isActive : false;
  };

  const renderItem = ({ item: user }) => (
    <TouchableOpacity
      className="border-b border-purple-200 py-4 flex-row items-center"
      onPress={() => onUserPress(user)}
    >
      <Image
        source={{ uri: user.avatar }}
        className="w-10 h-10 rounded-full mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg text-purple-900">
          {user.firstName} {user.lastName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemWithLastMessage = ({ item: user }) => (
    <TouchableOpacity
      className="border-b border-purple-200 py-4 flex-row items-center"
      onPress={() => onUserPress(user)}
    >
      <View className="relative mr-3">
        <Image
          source={{ uri: user.avatar }}
          className="w-10 h-10 rounded-full"
          resizeMode="cover"
        />
        {isUserOnline(user._id) && (
          <View className="absolute top-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-md" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-lg text-purple-900">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-gray-500">
          {truncateMessage(user.lastMessage, 30)}
        </Text>
      </View>
      {user.lastMessageDate && (
        <Text className="text-gray-400 text-sm">
          {formatDate(user.lastMessageDate)}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={searchQuery ? users : usersWithLastMessages}
        keyExtractor={(user) => user._id}
        renderItem={searchQuery ? renderItem : renderItemWithLastMessage}
        scrollEnabled={false}
        ListEmptyComponent={() =>
          (!searchQuery ? !usersWithLastMessages.length : !users.length) && (
            <Text className="text-center text-purple-900">No users found</Text>
          )
        }
      />
    </>
  );
};

export default UserList;
