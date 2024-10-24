import Conversation from '../models/conversation-model.js';
import User from '../models/user-model.js';
import Message from '../models/message-model.js';
import { sendMessageViaSocket } from '../services/socketService.js';
import { sendPushNotification } from '../services/pushNotificationService.js';
import { MAX_FILE_SIZE } from '../utils/constants.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, messageType, fileData } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (messageType !== 'text' && fileData) {
      const fileSize = Buffer.byteLength(fileData, 'base64');
      if (fileSize > MAX_FILE_SIZE) {
        return res.status(400).json({
          message: 'File size exceeds the maximum limit of 5MB',
        });
      }
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message: messageType === 'text' ? message : null,
      messageType,
      fileData: messageType !== 'text' ? fileData : null,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'firstName lastName avatar')
      .populate('receiverId', 'firstName lastName avatar');

    sendMessageViaSocket(receiverId, senderId, populatedMessage);

    const receiver = await User.findById(receiverId);
    await sendPushNotification(receiver, populatedMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate('messages');

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages.map((msg) => ({
      ...msg.toObject(),
      messageType: msg.messageType,
      fileData: msg.fileData,
    }));

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};
