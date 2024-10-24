import { Expo } from 'expo-server-sdk';
const expo = new Expo();

export const sendPushNotification = async (receiver, populatedMessage) => {
  if (receiver.expoPushToken && Expo.isExpoPushToken(receiver.expoPushToken)) {
    let messageBody;

    switch (populatedMessage.messageType) {
      case 'text':
        messageBody = `${populatedMessage.senderId.firstName} ${populatedMessage.senderId.lastName}: ${populatedMessage.message}`;
        break;
      case 'image':
        messageBody = `${populatedMessage.senderId.firstName} ${populatedMessage.senderId.lastName} sent an image.`;
        break;
      case 'file':
        messageBody = `${populatedMessage.senderId.firstName} ${populatedMessage.senderId.lastName} sent a file.`;
        break;
      default:
        messageBody = `${populatedMessage.senderId.firstName} ${populatedMessage.senderId.lastName} sent a message.`;
    }

    const pushMessages = [
      {
        to: receiver.expoPushToken,
        sound: 'default',
        body: messageBody,
        data: { receiver: populatedMessage.receiverId },
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
