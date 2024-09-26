import axios from '../utils/axios-config';

export const signUp = async (formData) => {
  const response = await axios.post('/auth/signup', formData);
  return response.data;
};

export const login = async (formData) => {
  const response = await axios.post('/auth/login', formData);
  return response.data;
};
