import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { verifyPhoneNumber } from '../services/authService';
import { verifyPhoneValidator } from '../validators/verifyPhoneValidator';
import styles from './../components/authForms/styles';

const VerifyPhoneScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const phoneInputRef = useRef(null);

  const handleVerifyPhone = async () => {
    const validationErrors = verifyPhoneValidator(phoneNumber);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);

    try {
      const response = await verifyPhoneNumber(phoneNumber);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Phone number verified. Proceed to reset password.',
      });

      phoneInputRef.current?.setState({ number: '' });
      setErrors('');
      navigation.navigate('ResetPassword', { userId: response.userId });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Unable to verify phone number.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-purple-50">
      <Text className="text-2xl font-bold text-purple-700 text-center mb-6">
        Verify Your Phone Number
      </Text>
      <Text className="text-purple-600 text-center mb-4">
        Please enter your phone number to verify your identity and proceed to
        reset your password.
      </Text>
      <View className="bg-white p-6 rounded-lg shadow-lg">
        <View className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm">
          <PhoneInput
            ref={phoneInputRef}
            defaultValue={phoneNumber}
            defaultCode="UA"
            onChangeFormattedText={setPhoneNumber}
            containerStyle={styles.phoneInputContainer}
            textContainerStyle={styles.phoneInputTextContainer}
            textInputStyle={styles.phoneInputText}
            codeTextStyle={styles.phoneInputCodeText}
          />
        </View>
        {errors.phoneNumber && (
          <Text className="text-red-500 text-xs mb-2">
            {errors.phoneNumber}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleVerifyPhone}
          className="bg-purple-700 p-4 rounded-lg shadow-lg"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Verify Phone Number
            </Text>
          )}
        </TouchableOpacity>
        <View className="mt-5 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="flex-row items-center"
          >
            <Icon name="arrow-back" size={16} color="#6B21A8" />
            <Text className="text-purple-700 text-xs ml-1">Back to Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VerifyPhoneScreen;
