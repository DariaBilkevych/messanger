import { io } from '../socket/socket.js';
import { getReceiverSocketId, getSenderSocketId } from '../socket/socket.js';

export const sendMessageViaSocket = (receiverId, senderId, message) => {
  const receiverSocketId = getReceiverSocketId(receiverId);
  const senderSocketId = getSenderSocketId(senderId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', message);

    if (senderSocketId) {
      io.to(receiverSocketId).emit('addUser', {
        _id: senderId,
        firstName: message.senderId.firstName,
        lastName: message.senderId.lastName,
        avatar: message.senderId.avatar,
        lastMessage: message.message,
      });
    }
  }
};
