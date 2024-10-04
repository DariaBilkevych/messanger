import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN_KEY } from './constants';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.104:5000/api',
  withCredentials: true,
});

const axiosNoAuthInstance = axios.create({
  baseURL: 'http://192.168.0.104:5000/api',
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
        const { accessToken } = await axiosNoAuthInstance.post(
          '/auth/refresh-token'
        );

        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (refreshError.response && refreshError.response.status === 403) {
          console.log('Trying to logout...');
          await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);

          const tokenAfterRemoval = await AsyncStorage.getItem(
            ACCESS_TOKEN_KEY
          );
          if (!tokenAfterRemoval) {
            console.log('Token successfully removed!');
          } else {
            console.log('Token still exists:', tokenAfterRemoval);
          }

          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosNoAuthInstance };
