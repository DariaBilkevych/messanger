import { axiosInstance } from '../utils/axios-config';

export const sendMessage = async (receiverId, message) => {
  const response = await axiosInstance.post(`/messages/${receiverId}`, {
    message,
  });
  return response.data;
};

export const getMessages = async (receiverId) => {
  const response = await axiosInstance.get(`/messages/${receiverId}`);
  return response.data;
};
