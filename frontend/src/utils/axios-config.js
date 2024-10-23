import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants';
import { navigate } from '../services/navigationService';

const axiosInstance = axios.create({
  baseURL: 'https://messanger-i8ye.onrender.com/api',
  withCredentials: true,
});

const axiosNoAuthInstance = axios.create({
  baseURL: 'https://messanger-i8ye.onrender.com/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (request) => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('Access Token expired, trying to refresh...');

      try {
        const storedRefreshToken =
          await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

        if (!storedRefreshToken) {
          throw new Error('Refresh token is missing');
        }

        const response = await axiosNoAuthInstance.post('/auth/refresh-token', {
          token: storedRefreshToken,
        });

        const { accessToken, newRefreshToken } = response.data;

        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (refreshError.response) {
          await axiosNoAuthInstance.post('/auth/logout');

          await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
          await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);

          navigate('Login');
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosNoAuthInstance };
