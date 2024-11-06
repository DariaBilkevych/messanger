import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUsersForSidebar, searchUsers } from '../services/userService';
import { logout } from '../services/authService';
import Toast from 'react-native-toast-message';
import SearchInput from '../components/common/SearchInput';
import UserList from '../components/user/UserList';
import Loading from '../components/common/Loading';
import UserHeader from '../components/common/UserHeader';
import { useDispatch, useSelector } from 'react-redux';
import { deauthenticate, fetchUser } from '../store/auth/authSlice';
import { disconnectSocket } from '../store/socket/socketSlice';
import {
  updateLastMessage,
  addUserWithLastMessage,
} from '../store/message/messageSlice';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useDebounce } from '../hooks/useDebounce';

const ContactsScreen = () => {
  usePushNotifications();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 700);
  const [isSearching, setIsSearching] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);

  const fetchUsers = async () => {
    try {
      const data = await getUsersForSidebar();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    try {
      if (query) {
        const data = await searchUsers(query);
        setUsers(data);
      } else {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUserPress = (user) => {
    setSearchQuery('');
    navigation.navigate('Chat', {
      receiverId: user._id,
      receiverName: `${user.firstName} ${user.lastName}`,
      receiverAvatar: user.avatar,
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      dispatch(deauthenticate());
      dispatch(disconnectSocket());
      navigation.replace('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to log out',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchUser());
    await fetchUsers();
    setSearchQuery('');
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUser());
      await fetchUsers();
      setInitialLoading(false);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (newMessage) => {
        console.log(newMessage);
        dispatch(
          updateLastMessage({
            senderId: newMessage.senderId._id,
            receiverId: newMessage.receiverId._id,
            message: newMessage.message,
            messageType: newMessage.messageType,
          })
        );
      });
      socket.on('addUser', (newUser) => {
        dispatch(addUserWithLastMessage(newUser));
      });
    }
    return () => {
      socket?.off('newMessage');
      socket?.off('addUser');
    };
  }, [socket, dispatch]);

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 px-4 bg-white">
      <UserHeader
        user={user}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {isSearching ? (
          <Loading />
        ) : (
          <UserList
            users={users}
            onUserPress={handleUserPress}
            searchQuery={searchQuery}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ContactsScreen;
