import { axiosInstance } from '../utils/axios-config';

export const getUserData = async () => {
  const response = await axiosInstance.get('/users/');
  return response.data;
};

export const getUsersForSidebar = async () => {
  const response = await axiosInstance.get('/users/chat-users');
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await axiosInstance.get(`/users/search`, {
    params: {
      query,
    },
  });
  return response.data;
};
