import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import Toast from 'react-native-toast-message';
import { MAX_FILE_SIZE } from './constants';

export const checkFileSize = (fileSize) => {
  if (fileSize > MAX_FILE_SIZE) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'File size exceeds the limit of 2 MB.',
    });
    return false;
  }
  return true;
};

export const readFileAsBase64 = async (uri) => {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
};

export const pickMedia = async (mediaType) => {
  let result;
  if (mediaType === 'image') {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  } else if (mediaType === 'file') {
    result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
    });
  }
  return result;
};

export const resizeImage = async (uri) => {
  return await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
};
