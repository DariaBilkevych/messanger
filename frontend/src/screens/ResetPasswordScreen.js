import React from 'react';
import { View } from 'react-native';
import ResetPasswordForm from '../components/authForms/ResetPasswordForm';

const ResetPasswordScreen = () => {
  return (
    <View className="flex-1 justify-center p-6 bg-purple-50">
      <ResetPasswordForm />
    </View>
  );
};

export default ResetPasswordScreen;
