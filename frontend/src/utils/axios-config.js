import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const token = await AsyncStorage.getItem('accessToken');
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { accessToken } = await axiosNoAuthInstance.post(
          '/auth/refresh-token'
        );
        await AsyncStorage.setItem('accessToken', accessToken);

        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await axiosNoAuthInstance.post('/auth/logout');
        await AsyncStorage.removeItem('accessToken');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosNoAuthInstance };
