import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import { resetPassword } from '../../services/authService';
import { validatePassword } from '../../validators/resetPasswordValidator';
import Toast from 'react-native-toast-message';

const ResetPasswordForm = ({ navigation, route }) => {
  const { userId } = route.params;
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleSubmit = async () => {
    setError('');
    const errors = validatePassword(formData);

    if (errors?.password) {
      setError(errors.password);
      return;
    }
    setLoading(true);

    try {
      await resetPassword(userId, { ...formData });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password successfully reset!',
      });
      navigation.navigate('Login');
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.log(error.response?.data);
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white p-6 rounded-lg shadow-lg">
      <Text className="text-3xl font-bold text-purple-700 text-center mb-6">
        Reset password
      </Text>

      <View className="relative">
        <TextInput
          className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
          placeholder="New Password"
          value={formData.newPassword}
          onChangeText={(text) =>
            setFormData({ ...formData, newPassword: text })
          }
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          className="absolute right-3 top-4"
        >
          <Feather
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={styles.passwordIcon.size}
            color={styles.passwordIcon.color}
          />
        </TouchableOpacity>
      </View>

      <View className="relative">
        <TextInput
          className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChangeText={(text) =>
            setFormData({ ...formData, confirmPassword: text })
          }
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity
          onPress={toggleConfirmPasswordVisibility}
          className="absolute right-3 top-4"
        >
          <Feather
            name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
            size={styles.passwordIcon.size}
            color={styles.passwordIcon.color}
          />
        </TouchableOpacity>
      </View>
      {error ? (
        <Text className="text-red-500 text-xs mb-2">{error}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-purple-700 p-4 rounded-lg shadow-lg"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">
            Reset password
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordForm;
