import { Expo } from 'expo-server-sdk';
const expo = new Expo();

export const sendPushNotification = async (receiver, populatedMessage) => {
  if (receiver.expoPushToken && Expo.isExpoPushToken(receiver.expoPushToken)) {
    const pushMessages = [
      {
        to: receiver.expoPushToken,
        sound: 'default',
        body: `${populatedMessage.senderId.firstName} ${populatedMessage.senderId.lastName}: ${populatedMessage.message}`,
        data: { message: populatedMessage },
      },
    ];

    try {
      const tickets = await expo.sendPushNotificationsAsync(pushMessages);
      console.log('Push notification tickets:', tickets);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
};
