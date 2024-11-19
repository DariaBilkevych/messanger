import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { updatePassword } from '../../../services/userService';
import Toast from 'react-native-toast-message';
import { validatePassword } from '../../../validators/profileValidator';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState('');

  useEffect(() => {
    const resetForm = () => {
      clearPasswordFields('all');
      setPasswordError('');
      setCurrentPasswordError('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    };

    const unsubscribe = navigation.addListener('blur', resetForm);

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const handlePasswordUpdate = async () => {
    setPasswordError('');
    setCurrentPasswordError('');

    const errors = validatePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );

    if (Object.keys(errors).length > 0) {
      setPasswordError(errors.password);

      if (
        errors.password === 'New password and confirm password do not match'
      ) {
        clearPasswordFields('newConfirm');
      }

      return;
    }

    setLoading(true);

    try {
      await updatePassword(currentPassword, newPassword, confirmPassword);
      Toast.show({
        type: 'success',
        text1: 'Password updated successfully',
      });
      clearPasswordFields('all');
      setPasswordError('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      setCurrentPasswordError(errorMessage);
      clearPasswordFields('current');
    } finally {
      setLoading(false);
    }
  };

  const clearPasswordFields = (fieldType) => {
    if (fieldType === 'all') {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else if (fieldType === 'newConfirm') {
      setNewPassword('');
      setConfirmPassword('');
    } else if (fieldType === 'current') {
      setCurrentPassword('');
    }
  };

  return (
    <View className="border border-gray-200 rounded-lg p-2 bg-white mb-6">
      <Text className="text-xs text-gray-500 mb-1">Change Password</Text>

      <View className="flex-row items-center">
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current Password"
          secureTextEntry={!showCurrentPassword}
          className="text-sm text-gray-700 border-b border-gray-200 p-2 mb-2 flex-1"
        />
        <TouchableOpacity
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <Icon
            name={showCurrentPassword ? 'eye' : 'eye-off'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {currentPasswordError ? (
        <Text className="text-red-500 text-xs mb-2">
          {currentPasswordError}
        </Text>
      ) : null}

      <View className="flex-row items-center">
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          secureTextEntry={!showNewPassword}
          className="text-sm text-gray-700 border-b border-gray-200 p-2 mb-2 flex-1"
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
          <Icon
            name={showNewPassword ? 'eye' : 'eye-off'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center">
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirmPassword}
          className="text-sm text-gray-700 border-b border-gray-200 p-2 mb-2 flex-1"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Icon
            name={showConfirmPassword ? 'eye' : 'eye-off'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {passwordError ? (
        <Text className="text-red-500 text-xs mb-2">{passwordError}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handlePasswordUpdate}
        className="bg-purple-900 p-2 rounded-md flex-row justify-center items-center"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text className="text-center text-white">Update Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;
