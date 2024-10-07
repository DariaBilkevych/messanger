import { axiosNoAuthInstance } from '../utils/axios-config';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signUp = async (formData) => {
  const response = await axiosNoAuthInstance.post('/auth/signup', formData);
  const { accessToken, refreshToken } = response.data;

  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  return response.data;
};

export const login = async (formData) => {
  const response = await axiosNoAuthInstance.post('/auth/login', formData);
  const { accessToken, refreshToken } = response.data;

  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

  return response.data;
};

export const logout = async () => {
  const response = await axiosNoAuthInstance.post('/auth/logout');

  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);

  return response.data;
};

// export const refreshToken = async () => {
//   const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

//   if (!storedRefreshToken) {
//     throw new Error('Refresh Token is missing');
//   }

//   const response = await axiosNoAuthInstance.post('/auth/refresh-token', {
//     token: storedRefreshToken,
//   });

//   const { accessToken, refreshToken } = response.data;

//   await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
//   await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

//   return response.data;
// };
