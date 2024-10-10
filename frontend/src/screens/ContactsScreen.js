import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
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
import { useAuth } from '../context/AuthContext';

const ContactsScreen = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { setIsLoggedIn } = useAuth();
  const navigation = useNavigation();

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
      const data = await getUsersForSidebar();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSearch = async (query) => {
    try {
      if (query) {
        const data = await searchUsers(query);
        setUsers(data);
      } else {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const handleUserPress = (user) => {
    setSearchQuery('');
    navigation.navigate('Chat', {
      receiverId: user._id,
      receiverName: user.firstName + ' ' + user.lastName,
      receiverAvatar: user.avatar,
    });
  };

  const handleLogout = async () => {
    try {
      await logout(setIsLoggedIn);
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to log out',
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      await fetchUsers();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 px-4 bg-white">
      <UserHeader user={user} onLogout={handleLogout} />
      <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <UserList users={users} onUserPress={handleUserPress} />
    </View>
  );
};

export default ContactsScreen;
