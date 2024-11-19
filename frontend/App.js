import React from 'react';
import { useWindowDimensions } from 'react-native';
import Navigation from './src/navigation/Navigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { usePushNotifications } from './src/hooks/usePushNotifications';

export default function App() {
  usePushNotifications();

  const { height } = useWindowDimensions();
  const topOffset = height * 0.1;

  return (
    <Provider store={store}>
      <Navigation />
      <Toast position="top" topOffset={topOffset} />
    </Provider>
  );
}
