import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';

const SignUpForm = ({ onSubmit, errors, formData, setFormData }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
          value={formData.phoneNumber}
          defaultCode="UA"
          onChangeFormattedText={(text) => {
            setFormData({ ...formData, phoneNumber: text });
          }}
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
        onPress={onSubmit}
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
