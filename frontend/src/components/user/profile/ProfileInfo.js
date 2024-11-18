import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../../store/auth/authSlice';
import { updateName, updateAvatar } from '../../../services/userService';
import { pickMedia } from '../../../utils/fileUtils';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { validateName } from '../../../validators/profileValidator';

const ProfileInfo = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [avatarUri, setAvatarUri] = useState(null);
  const [avatarName, setAvatarName] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [nameError, setNameError] = useState('');

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

    const resetNameFields = () => {
      setNewFirstName('');
      setNewLastName('');
      setNameError('');
      setEditingName(false);
    };

    const unsubscribe = navigation.addListener('blur', resetNameFields);

    return () => {
      unsubscribe();
    };
  }, [editingName, newFirstName, newLastName, navigation]);

  useEffect(() => {
    if (avatarUri) {
      handleAvatarUpdate();
    }
  }, [avatarUri]);

  const handleNameEdit = () => {
    setNewFirstName(user.firstName);
    setNewLastName(user.lastName);
    setEditingName(true);
  };

  const handleNameUpdate = async () => {
    const errors = validateName(newFirstName, newLastName);

    if (errors.name) {
      setNameError(errors.name);
      return;
    }

    setNameError('');

    await updateName(newFirstName, newLastName);
    dispatch(
      updateUserProfile({ firstName: newFirstName, lastName: newLastName })
    );

    setEditingName(false);
  };

  const handleCancelEditing = () => {
    setNewFirstName(user.firstName);
    setNewLastName(user.lastName);
    setEditingName(false);
    setNameError('');
  };

  const pickAvatar = async () => {
    const result = await pickMedia('image');
    if (!result.canceled) {
      const selectedFile = result.assets[0];
      setAvatarUri(selectedFile.uri);
      setAvatarName(result.assets[0].fileName || 'selected_image.jpg');
      setLoadingAvatar(true);
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      let avatarObject = null;

      if (avatarUri) {
        avatarObject = {
          uri: avatarUri,
          name: avatarName || 'image.jpg',
          type: 'image/jpeg',
        };
      }

      await updateAvatar(avatarObject);
      dispatch(updateUserProfile({ avatar: avatarObject.uri }));

      setAvatarUri(null);
      setAvatarName(null);
      setLoadingAvatar(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      Toast.show({
        type: 'error',
        text1: 'Try another one, please.',
        text2: errorMessage,
      });
      setLoadingAvatar(false);
    }
  };

  return (
    <View className="border border-gray-200 rounded-lg p-2 bg-white mb-6">
      <View className="flex-row items-center mb-3">
        <View className="items-center">
          <TouchableOpacity onPress={pickAvatar}>
            <View className="relative">
              <Image
                source={{ uri: user.avatar }}
                className="w-12 h-12 rounded-full"
              />
              {loadingAvatar && (
                <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50 rounded-full">
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickAvatar} className="mt-1">
            <Text className="text-xs text-purple-800">Edit</Text>
          </TouchableOpacity>
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-sm text-gray-600">
            Tap and enter your new name and update profile picture, if you want
          </Text>
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleNameEdit}
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
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-700">
                {user.firstName} {user.lastName}
              </Text>
              <TouchableOpacity onPress={handleNameEdit}>
                <Icon name="pencil" size={16} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
        {nameError ? (
          <Text className="text-xs text-red-500 mt-2 px-2">{nameError}</Text>
        ) : null}
      </View>
    </View>
  );
};

export default ProfileInfo;
