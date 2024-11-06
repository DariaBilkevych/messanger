import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, updateUserProfile } from '../store/auth/authSlice';
import { updateName, updateAvatar } from '../services/userService';
import Loading from '../components/common/Loading';
import { pickMedia } from '../utils/fileUtils';

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [fileUri, setFileUri] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchUser());
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleNameUpdate = async () => {
    if (!newFirstName || !newLastName) {
      alert('Name fields cannot be empty');
      return;
    }
    await updateName(newFirstName, newLastName);
    dispatch(
      updateUserProfile({ firstName: newFirstName, lastName: newLastName })
    );
    setEditingName(false);
  };

  const pickAvatar = async () => {
    const result = await pickMedia('image');
    if (!result.canceled) {
      const selectedFile = result.assets[0];
      setFileUri(selectedFile.uri);

      const updatedUser = await updateAvatar(selectedFile);
      dispatch(updateUserProfile({ avatar: updatedUser.avatar }));
    }
  };

  const handleCancelEditing = () => {
    setNewFirstName(user.firstName);
    setNewLastName(user.lastName);
    setEditingName(false);
  };

  useEffect(() => {
    if (editingName) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={handleCancelEditing}>
            <Text className="text-lg ml-3">Cancel</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={handleNameUpdate}>
            <Text className="text-lg font-bold mr-3">Done</Text>
          </TouchableOpacity>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: null,
        headerRight: null,
      });
    }
  }, [editingName, newFirstName, newLastName, navigation]);

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <View className="border border-gray-200 rounded-lg p-2 bg-white mb-6">
        <View className="flex-row items-center mb-3">
          <View className="items-center">
            <TouchableOpacity onPress={pickAvatar}>
              <Image
                source={{ uri: user.avatar }}
                className="w-12 h-12 rounded-full"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickAvatar} className="mt-1">
              <Text className="text-xs text-blue-500">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-sm text-gray-600">
              Enter your name and add and update profile picture, if you want
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setEditingName(true)}
            className="border-t border-b border-gray-200 rounded-md p-2"
          >
            {editingName ? (
              <View className="flex-row space-x-2">
                <TextInput
                  value={newFirstName}
                  onChangeText={setNewFirstName}
                  placeholder="First Name"
                  className="text-sm text-gray-700 w-1/2"
                />
                <TextInput
                  value={newLastName}
                  onChangeText={setNewLastName}
                  placeholder="Last Name"
                  className="text-sm text-gray-700 w-1/2"
                />
              </View>
            ) : (
              <Text className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className="border border-gray-200 rounded-lg p-2 bg-white">
        <Text className="text-xs text-gray-500 mb-1">Phone Number</Text>
        <TextInput
          value={user.phoneNumber}
          editable={false}
          className="text-sm text-gray-700"
        />
      </View>
    </View>
  );
};

export default ProfileScreen;
