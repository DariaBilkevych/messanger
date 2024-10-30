import Conversation from '../models/conversation-model.js';
import User from '../models/user-model.js';
import Message from '../models/message-model.js';
import { sendMessageViaSocket } from '../services/socketService.js';
import { sendPushNotification } from '../services/pushNotificationService.js';

import { cloudinary } from '../utils/cloudinary.js';

export const sendMessage = async (req, res) => {
  try {
    const { messageType } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let fileUri = null;

    if (messageType !== 'text') {
      const file = req.file;

      if (file) {
        const resourceType = messageType === 'file' ? 'raw' : 'image';

        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: resourceType,
          ...(messageType === 'file' && { pages: true }),
        });

        fileUri = result.secure_url;
      } else {
        return res.status(400).json({ message: 'No file provided' });
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
      message: messageType === 'text' ? req.body.message : null,
      messageType,
      src: messageType !== 'text' ? fileUri : null,
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
