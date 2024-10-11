import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import Toast from 'react-native-toast-message';
import { signUp } from '../../services/authService';
import { signUpValidator } from '../../validators/signUpValidator';
import { useAuth } from '../../context/AuthContext';

const SignUpForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const phoneInputRef = React.useRef(null);
  const { setIsLoggedIn } = useAuth();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSignUp = async () => {
    setErrors({});
    const newErrors = signUpValidator(formData);

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await signUp(formData, setIsLoggedIn);
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
      });
      phoneInputRef.current?.setState({ number: '' });
      navigation.navigate('Contacts');
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
        Sign Up
      </Text>

      <TextInput
        className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        keyboardType="default"
      />
      {errors.firstName && (
        <Text className="text-red-500 text-xs mb-1">{errors.firstName}</Text>
      )}

      <TextInput
        className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm"
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        keyboardType="default"
      />
      {errors.lastName && (
        <Text className="text-red-500 text-xs mb-2">{errors.lastName}</Text>
      )}

      <View className="border border-purple-300 p-3 mb-3 rounded-lg shadow-sm">
        <PhoneInput
          ref={phoneInputRef}
          value={formData.phoneNumber}
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
        onPress={handleSignUp}
        className="bg-purple-700 p-4 rounded-lg shadow-lg"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpForm;
