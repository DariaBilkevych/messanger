import { FlatList, TouchableOpacity, Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';

const UserList = ({ users, onUserPress, searchQuery }) => {
  const { usersWithLastMessages } = useSelector((state) => state.messages);

  const truncateMessage = (message, maxLength) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  };

  const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString, { zone: 'Europe/Kyiv' });
    return date.toFormat('d MMM');
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
      <Image
        source={{ uri: user.avatar }}
        className="w-10 h-10 rounded-full mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg text-purple-900">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-gray-500">
          {truncateMessage(user.lastMessage, 30)}
        </Text>
      </View>
      {user.lastMessageDate && (
        <Text className="text-gray-400">
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
