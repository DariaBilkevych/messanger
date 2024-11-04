import { Expo } from 'expo-server-sdk';
const expo = new Expo();

export const sendPushNotification = async (receiver, populatedMessage) => {
  if (receiver.expoPushToken && Expo.isExpoPushToken(receiver.expoPushToken)) {
    const senderFullName = `${populatedMessage.senderId.firstName} ${populatedMessage.senderId.lastName}`;
    let messageBody;

    switch (populatedMessage.messageType) {
      case 'text':
        messageBody = `${senderFullName}: ${populatedMessage.message}`;
        break;
      case 'image':
        messageBody = `${senderFullName} sent an image.`;
        break;
      case 'file':
        messageBody = `${senderFullName} sent a file.`;
        break;
      default:
        messageBody = `${senderFullName} sent a message.`;
    }

    const pushMessages = [
      {
        to: receiver.expoPushToken,
        sound: 'default',
        body: messageBody,
        data: { sender: populatedMessage.senderId },
      },
    ];

    try {
      const tickets = await expo.sendPushNotificationsAsync(pushMessages);
      console.log('Push notification tickets:', tickets);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }

    console.log(
      'Push Notification Object:',
      JSON.stringify(pushMessages, null, 2)
    );
  }
};
