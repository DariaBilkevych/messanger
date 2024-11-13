import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  getUserData,
  getUsersForSidebar,
  searchUsers,
} from '../services/userService';
import { logout } from '../services/authService';
import Toast from 'react-native-toast-message';
import SearchInput from '../components/common/SearchInput';
import UserList from '../components/user/UserList';
import Loading from '../components/common/Loading';
import UserHeader from '../components/common/UserHeader';
import { useDispatch, useSelector } from 'react-redux';
import { deauthenticate } from '../store/auth/authSlice';
import { disconnectSocket } from '../store/socket/socketSlice';
import {
  updateLastMessage,
  addUserWithLastMessage,
} from '../store/message/messageSlice';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { useDebounce } from '../hooks/useDebounce';
import { fetchLastMessages } from '../utils/messageThunks';

const ContactsScreen = () => {
  usePushNotifications();

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [isFetchingAllUsers, setIsFetchingAllUsers] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUser(data);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsFetchingAllUsers(true);
      const data = await getUsersForSidebar();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsFetchingAllUsers(false);
    }
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchQuery(query);

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
    await fetchUserData();
    await fetchUsers();
    setSearchQuery('');
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchUsers();
      setInitialLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsSearching(true);
  }, [searchQuery]);

  useEffect(() => {
    handleSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (newMessage) => {
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

  useEffect(() => {
    if (!searchQuery) {
      setLoadingMessages(true);
      dispatch(fetchLastMessages(users)).finally(() =>
        setLoadingMessages(false)
      );
    }
  }, [users, searchQuery, dispatch]);

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
        {isSearching || loadingMessages || isFetchingAllUsers ? (
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
