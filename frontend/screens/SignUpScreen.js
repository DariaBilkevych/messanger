import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import axios from '../utils/axios-config';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const validateInput = () => {
    const newErrors = {};

    if (!firstName || firstName.length < 1 || firstName.length > 30) {
      newErrors.firstName =
        'Required and should be between 1 and 30 characters';
    }
    if (!lastName || lastName.length < 1 || lastName.length > 30) {
      newErrors.lastName = 'Required and should be between 1 and 30 characters';
    }
    if (!phoneNumber || !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Should be between 10 to 15 digits';
    }
    if (!password || password.length < 8) {
      newErrors.password = 'Should be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const response = await axios.post('/auth/signup', {
        firstName,
        lastName,
        phoneNumber,
        password,
      });

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
      <View className="bg-white p-6 rounded-lg shadow-lg">
        <Text className="text-3xl font-bold text-purple-700 text-center mb-6">
          Sign Up
        </Text>

        <TextInput
          className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          keyboardType="default"
        />
        {errors.firstName && (
          <Text className="text-red-500 text-xs mb-1">{errors.firstName}</Text>
        )}

        <TextInput
          className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          keyboardType="default"
        />
        {errors.lastName && (
          <Text className="text-red-500 text-xs mb-2">{errors.lastName}</Text>
        )}

        <TextInput
          className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        {errors.phoneNumber && (
          <Text className="text-red-500 text-xs mb-2">
            {errors.phoneNumber}
          </Text>
        )}

        <TextInput
          className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password && (
          <Text className="text-red-500 text-xs mb-2">{errors.password}</Text>
        )}

        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-purple-700 p-4 rounded-lg shadow-lg"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpScreen;
