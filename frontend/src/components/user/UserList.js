import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity, Image, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLastMessages } from '../../store/message/messageSlice';
import Loading from '../common/Loading';
import { DateTime } from 'luxon';

const UserList = ({ users, onUserPress }) => {
  const dispatch = useDispatch();
  const { usersWithLastMessages, loading } = useSelector(
    (state) => state.messages
  );

  const truncateMessage = (message, maxLength) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + '...'
      : message;
  };

  const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString, { zone: 'Europe/Kyiv' });
    return date.toFormat('d MMM');
  };

  useEffect(() => {
    dispatch(fetchLastMessages(users));
  }, [users, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={usersWithLastMessages}
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
      ListEmptyComponent={() =>
        !usersWithLastMessages.length && (
          <Text className="text-center text-purple-900">No users found</Text>
        )
      }
    />
  );
};

export default UserList;
