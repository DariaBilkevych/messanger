export const verifyPhoneValidator = (phoneNumber) => {
  const newErrors = {};

  if (!phoneNumber || !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
    newErrors.phoneNumber = 'Phone number should be between 10 to 15 digits';
  }

  return newErrors;
};
