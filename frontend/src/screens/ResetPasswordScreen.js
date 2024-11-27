import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ResetPasswordForm from '../components/authForms/ResetPasswordForm';

const ResetPasswordScreen = ({ navigation, route }) => {
  return (
    <View className="flex-1 justify-center p-6 bg-purple-50">
      <ResetPasswordForm navigation={navigation} route={route} />
      <View className="mt-4 flex-row justify-center items-center">
        <Text className="text-purple-700">Remembered your password? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-purple-700 font-semibold underline">
            Log In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;
