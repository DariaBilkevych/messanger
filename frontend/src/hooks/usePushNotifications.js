import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, AppState } from 'react-native';
import { navigate } from '../services/navigationService';

export const usePushNotifications = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [notificationData, setNotificationData] = useState(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: appState !== 'active',
      shouldSetBadge: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification');
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
    } else {
      alert('Must be using a physical device for Push notifications');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  const handleNotificationNavigation = (notification) => {
    const { data } = notification?.request?.content;
    if (data?.sender) {
      const { _id, firstName, lastName, avatar } = data.sender;
      navigate('Chat', {
        receiverId: _id,
        receiverName: `${firstName} ${lastName}`,
        receiverAvatar: avatar,
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (appState !== 'active') {
        setNotificationData(response?.notification);
      }
    });

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
      if (nextAppState === 'active' && notificationData) {
        handleNotificationNavigation(notificationData);
        setNotificationData(null);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotificationData(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (appState !== 'active') {
          setNotificationData(response.notification);
        } else {
          handleNotificationNavigation(response.notification);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      subscription.remove();
    };
  }, [appState, notificationData]);

  return {
    expoPushToken,
    notificationData,
  };
};
