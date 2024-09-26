import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { login } from '../services/authService';
import LoginForm from '../components/authForms/LoginForm';
import { loginValidator } from '../validators/loginValidator';

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const handleLogin = async () => {
    const newErrors = loginValidator(formData);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged in successfully!',
      });

      navigation.navigate('Home');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-purple-50">
      <LoginForm
        onSubmit={handleLogin}
        errors={errors}
        formData={formData}
        setFormData={setFormData}
      />
    </View>
  );
};

export default LoginScreen;
