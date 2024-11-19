import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/auth/authSlice';
import Loading from '../components/common/Loading';
import ProfileInfo from '../components/user/profile/ProfileInfo';
import ChangePassword from '../components/user/profile/ChangePassword';
import {
  ANDROID_KEYBOARD_OFFSET,
  IOS_KEYBOARD_OFFSET,
} from '../utils/constants';

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchUser());
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? IOS_KEYBOARD_OFFSET : ANDROID_KEYBOARD_OFFSET
      }
    >
      <ScrollView
        className="flex-1  bg-gray-100 p-6"
        keyboardShouldPersistTaps="handled"
      >
        <ProfileInfo navigation={navigation} />

        <View className="border border-gray-200 rounded-lg p-2 bg-white mb-6">
          <Text className="text-xs text-gray-500 mb-1">Phone Number</Text>
          <TextInput
            value={user.phoneNumber}
            editable={false}
            className="text-sm text-gray-700"
          />
        </View>

        <ChangePassword navigation={navigation} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
