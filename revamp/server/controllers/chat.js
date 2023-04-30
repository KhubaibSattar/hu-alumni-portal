import mongoose from 'mongoose';
import Chat from '../models/chatSchema.js';
import User from '../models/user.js';


export const createChat = async (req, res) => {
  const { participants } = req.body;

  try {
    // Check if participants exist and are valid users
    const validParticipants = await User.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
      return res.status(400).json({ message: 'Invalid participants' });
    }

    // Create a new chat with the given participants
    const newChat = await Chat.create({ participants });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: 'Chat creation failed' });
  }
};

export const getChatsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find chats where the user is a participant
    const chats = await Chat.find({ participants: mongoose.Types.ObjectId(userId) });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

export const getChatById = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find a specific chat by its ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat' });
  }
};

export const addMessageToChat = async (req, res) => {
  const { chatId } = req.params;
  const { sender, content } = req.body;
  const io = req.app.io; 

  try {
    // Find the chat by its ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add the new message to the chat
    chat.messages.push({ sender, content });
    await chat.save();

    // Emit the new message to all participants in the chat
    io.to(chatId).emit('new_message', chat);

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add message to chat' });
  }
};
