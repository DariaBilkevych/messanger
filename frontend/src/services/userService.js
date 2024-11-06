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

export const updateName = async (firstName, lastName) => {
  const response = await axiosInstance.put('/users/update-name', {
    firstName,
    lastName,
  });
  return response.data;
};

export const updateAvatar = async (avatarFile) => {
  const formData = new FormData();

  formData.append('avatar', {
    uri: avatarFile.uri,
    type: avatarFile.type,
    name: avatarFile.fileName,
  });

  const response = await axiosInstance.put('/users/update-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updatePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  const response = await axiosInstance.put('/users/update-password', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
