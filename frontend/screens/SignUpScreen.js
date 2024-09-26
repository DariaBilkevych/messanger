import React, { useState } from 'react';
import { View } from 'react-native';
import axios from '../utils/axios-config';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import SignUpForm from '../components/SignUpForm/SignUpForm';
import { signUpValidator } from '../validators/signUpValidator';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const handleSignUp = async () => {
    const newErrors = signUpValidator(formData);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/auth/signup', formData);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User registered successfully!',
      });

      navigation.navigate('Home');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Something went wrong';

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-purple-50">
      <SignUpForm
        onSubmit={handleSignUp}
        errors={errors}
        formData={formData}
        setFormData={setFormData}
      />
    </View>
  );
};

export default SignUpScreen;
