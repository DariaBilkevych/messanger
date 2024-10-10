import Conversation from '../models/conversation-model.js';
import Message from '../models/message-model.js';
import { getReceiverSocketId } from '../socket/socket.js';
import { io } from '../socket/socket.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

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
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log(receiverSocketId);
    if (receiverSocketId) {
      console.log(`Sending message to socket ID: ${receiverSocketId}`);
      console.log(newMessage);
      // used to send events to specific client
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

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

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong', error: error.message });
  }
};
