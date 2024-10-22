import React from 'react';
import Navigation from './src/navigation/Navigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { usePushNotifications } from './src/hooks/usePushNotifications';

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  const data = JSON.stringify(notification, null, 2);

  console.log(`Token: ${expoPushToken?.data}. Data: ${data}`);
  return (
    <Provider store={store}>
      <Navigation />
      <Toast position="top" topOffset={100} />
    </Provider>
  );
}
