import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SignUpForm from '../components/authForms/SignUpForm';

const SignUpScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center p-6 bg-purple-50">
      <SignUpForm navigation={navigation} />
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
