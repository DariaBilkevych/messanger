import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../components/authForms/LoginForm';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center p-6 bg-purple-50">
      <LoginForm navigation={navigation} />
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="text-purple-700">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
          <Text className="text-purple-700 font-semibold underline">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
