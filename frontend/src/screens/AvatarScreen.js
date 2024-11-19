import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { pickMedia } from '../utils/fileUtils';
import { updateAvatar, deleteAvatar } from '../services/userService';
import { updateUserProfile } from '../store/auth/authSlice';
import Toast from 'react-native-toast-message';
import { DEFAULT_AVATAR_URI } from '../utils/constants';

const AvatarScreen = ({ route, navigation }) => {
  const { avatarUri } = route.params;
  const dispatch = useDispatch();

  const [newAvatarUri, setNewAvatarUri] = useState(avatarUri);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);

  const isDefaultAvatar = newAvatarUri.startsWith(DEFAULT_AVATAR_URI);

  useEffect(() => {
    setAvatarChanged(newAvatarUri !== avatarUri);
  }, [newAvatarUri, avatarUri]);

  const pickNewAvatar = async () => {
    const result = await pickMedia('image');
    if (!result.canceled) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      setLoadingAvatar(true);
      await updateAvatar({
        uri: newAvatarUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      dispatch(updateUserProfile({ avatar: newAvatarUri }));
      setLoadingAvatar(false);
      navigation.goBack();
    } catch (error) {
      setLoadingAvatar(false);
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      Toast.show({
        type: 'error',
        text1: 'Try another one, please.',
        text2: errorMessage,
      });
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setLoadingAvatar(true);
      const response = await deleteAvatar();
      dispatch(updateUserProfile({ avatar: response.avatar }));
      setLoadingAvatar(false);
      navigation.goBack();
    } catch (error) {
      setLoadingAvatar(false);
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      Toast.show({
        type: 'error',
        text1: 'Error deleting avatar.',
        text2: errorMessage,
      });
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <View className="relative">
        <Image
          source={{ uri: newAvatarUri }}
          className="w-40 h-40 rounded-full"
        />
        {loadingAvatar && (
          <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-60 rounded-full">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
      <View className="mt-4 justify-center items-center">
        <TouchableOpacity onPress={pickNewAvatar}>
          <Text className="text-lg text-purple-800">
            Change profile picture
          </Text>
        </TouchableOpacity>
        {!isDefaultAvatar && (
          <TouchableOpacity onPress={handleDeleteAvatar} className="mt-2">
            <Text className="text-lg text-red-600">Delete profile picture</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleAvatarUpdate}
          disabled={loadingAvatar || !avatarChanged}
          className={`mt-4 bg-purple-900 text-white p-2 rounded-md ${
            loadingAvatar || !avatarChanged ? 'opacity-50' : ''
          } w-auto`}
        >
          <Text className="text-lg text-white">Save changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AvatarScreen;
