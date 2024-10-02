import React from 'react';
import Navigation from './src/navigation/Navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <Navigation />
      <Toast position="top" topOffset={100} />
    </>
  );
}
