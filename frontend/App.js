import React, { useEffect } from 'react';
import Navigation from './src/navigation/Navigation';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import * as Notifications from 'expo-notifications';
import { navigate } from './src/services/navigationService';

export default function App() {
  useEffect(() => {
    const handleNotificationNavigation = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        const { data } = response.notification.request.content;
        if (data?.sender) {
          const { _id, firstName, lastName, avatar } = data.sender;
          navigate('Chat', {
            receiverId: _id,
            receiverName: `${firstName} ${lastName}`,
            receiverAvatar: avatar,
          });
        }
      }
    };

    handleNotificationNavigation();

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationNavigation(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <Provider store={store}>
      <Navigation />
      <Toast position="top" topOffset={100} />
    </Provider>
  );
}
