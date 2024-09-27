import { axiosNoAuthInstance } from '../utils/axios-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signUp = async (formData) => {
  const response = await axiosNoAuthInstance.post('/auth/signup', formData);
  const { accessToken } = response.data;
  await AsyncStorage.setItem('accessToken', accessToken);

  return response.data;
};

export const login = async (formData) => {
  const response = await axiosNoAuthInstance.post('/auth/login', formData);
  const { accessToken } = response.data;
  await AsyncStorage.setItem('accessToken', accessToken);

  return response.data;
};

export const logout = async () => {
  const response = await axiosNoAuthInstance.post('/auth/logout');
  await AsyncStorage.removeItem('accessToken');

  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosNoAuthInstance.post('/auth/refresh-token');
  return response.data;
};
