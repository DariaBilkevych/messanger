import { axiosInstance } from '../utils/axios-config';

export const sendMessage = async (receiverId, message, messageType, file) => {
  if (messageType === 'text') {
    const response = await axiosInstance.post(
      `/messages/send/${receiverId}`,
      {
        message,
        messageType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } else {
    const formData = new FormData();
    formData.append('messageType', messageType);

    if (file) {
      formData.append('file', file);
    }

    const response = await axiosInstance.post(
      `/messages/send/${receiverId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
};

export const getMessages = async (receiverId) => {
  const response = await axiosInstance.get(`/messages/${receiverId}`);
  return response.data;
};
