import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import { login } from '../../services/authService';
import { loginValidator } from '../../validators/loginValidator';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { authenticate } from '../../store/auth/authSlice';

const LoginForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const phoneInputRef = useRef(null);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async () => {
    setErrors({});

    const newErrors = loginValidator(formData);
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData);
      dispatch(authenticate());

      navigation.navigate('Contacts');
      setFormData({ phoneNumber: '', password: '' });
      phoneInputRef.current?.setState({ number: '' });
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
    <View className="bg-white p-6 rounded-lg shadow-lg">
      <Text className="text-3xl font-bold text-purple-700 text-center mb-6">
        Log In
      </Text>

      <View className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm">
        <PhoneInput
          ref={phoneInputRef}
          defaultValue={formData.phoneNumber}
          defaultCode="UA"
          onChangeFormattedText={(text) =>
            setFormData({ ...formData, phoneNumber: text })
          }
          containerStyle={styles.phoneInputContainer}
          textContainerStyle={styles.phoneInputTextContainer}
          textInputStyle={styles.phoneInputText}
          codeTextStyle={styles.phoneInputCodeText}
        />
      </View>
      {errors.phoneNumber && (
        <Text className="text-red-500 text-xs mb-2">{errors.phoneNumber}</Text>
      )}

      <View className="relative">
        <TextInput
          className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          className="absolute right-3 top-4"
        >
          <Feather
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={styles.passwordIcon.size}
            color={styles.passwordIcon.color}
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text className="text-red-500 text-xs mb-2">{errors.password}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-purple-700 p-4 rounded-lg shadow-lg"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
