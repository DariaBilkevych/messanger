import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Image, Text, View } from 'react-native';
import { getMessages } from '../../services/chatService';
import Loading from '../common/Loading';
import moment from 'moment-timezone';

const UserList = ({ users, onUserPress }) => {
  const [usersWithLastMessage, setUsersWithLastMessage] = useState([]);
  const [loading, setLoading] = useState(true);

  const truncateMessage = (message, maxLength) => {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + '...';
    }
    return message;
  };

  const formatDate = (dateString) => {
    const date = moment(dateString).tz('Europe/Kyiv');
    return date.format('D MMM');
  };

  useEffect(() => {
    const fetchLastMessages = async () => {
      setLoading(true);
      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          const messages = await getMessages(user._id);
          const lastMessage =
            messages.length > 0
              ? messages[messages.length - 1]
              : { message: 'No messages here', createdAt: null };

          return {
            ...user,
            lastMessage: lastMessage.message,
            lastMessageDate: lastMessage.createdAt,
          };
        })
      );
      setUsersWithLastMessage(updatedUsers);
      setLoading(false);
    };

    fetchLastMessages();
  }, [users]);

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={usersWithLastMessage}
      keyExtractor={(user) => user._id}
      renderItem={({ item: user }) => (
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
      )}
      ListEmptyComponent={() => (
        <Text className="text-center text-purple-900">No users found</Text>
      )}
    />
  );
};

export default UserList;
