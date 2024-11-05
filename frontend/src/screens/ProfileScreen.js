import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, Button } from 'react-native';
import { getUserData } from '../services/userService';
import Loading from '../components/common/Loading';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUser(data);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: user.avatar }}
          className="w-16 h-16 rounded-full mr-4"
        />
        <Text className="text-xl font-bold">
          {user.firstName} {user.lastName}
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-lg font-semibold">Phone Number</Text>
        <Text className="border border-gray-300 p-2 rounded mt-1 bg-gray-100">
          {user.phoneNumber}
        </Text>
      </View>

      <View>
        <Text className="text-lg font-semibold mb-2">Change Password</Text>
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current Password"
          className="border border-gray-300 p-2 rounded mb-2"
          secureTextEntry
        />
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          className="border border-gray-300 p-2 rounded mb-2"
          secureTextEntry
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          className="border border-gray-300 p-2 rounded mb-4"
          secureTextEntry
        />
        <Button
          title="Update Password"
          onPress={() => {
            /* some code */
          }}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;
