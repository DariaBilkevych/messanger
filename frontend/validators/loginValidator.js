import { MAX_PASSWORD_LENGTH } from '../src/utils/constants';

export const loginValidator = (formData) => {
  const { phoneNumber, password } = formData;
  const newErrors = {};

  if (!phoneNumber || !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
    newErrors.phoneNumber =
      'Phone number should be numbers between 10 to 15 digits';
  }
  if (!password || password.length < MAX_PASSWORD_LENGTH) {
    newErrors.password = 'Password should be at least 8 characters long';
  }

  return newErrors;
};
