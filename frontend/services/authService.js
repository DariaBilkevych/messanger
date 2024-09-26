import axios from '../utils/axios-config';

export const signUp = async (formData) => {
  try {
    const response = await axios.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Something went wrong';
  }
};
