import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { signUp } from '../services/authService';
import SignUpForm from '../components/authForms/SignUpForm';
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
    setErrors({});

    const newErrors = signUpValidator(formData);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await signUp(formData);

      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
      });

      navigation.navigate('ChatList');
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
      <SignUpForm
        onSubmit={handleSignUp}
        errors={errors}
        formData={formData}
        setFormData={setFormData}
      />
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="text-purple-700">Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-purple-700 font-semibold underline">
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;
