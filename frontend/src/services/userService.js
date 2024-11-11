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

  if (avatarFile) {
    formData.append('avatar', avatarFile);
  } else {
    console.error('No avatar file selected');
    return;
  }

  const response = await axiosInstance.put('/users/update-avatar', formData);

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
