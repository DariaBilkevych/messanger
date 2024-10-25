import { axiosInstance } from '../utils/axios-config';

export const sendMessage = async (
  receiverId,
  message,
  messageType,
  fileData
) => {
  const response = await axiosInstance.post(`/messages/send/${receiverId}`, {
    message,
    messageType,
    fileData,
  });
  return response.data;
};

export const getMessages = async (receiverId) => {
  const response = await axiosInstance.get(`/messages/${receiverId}`);
  return response.data;
};
