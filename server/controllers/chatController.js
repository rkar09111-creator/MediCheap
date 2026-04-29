import Chat from '../models/Chat.js';

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('customer', 'name phone email').sort('-updatedAt');
    res.status(200).json({ status: 'success', data: { chats } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('customer').populate('messages.sender', 'name');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.status(200).json({ status: 'success', data: { chat } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, attachment } = req.body;
    const chat = await Chat.findById(req.params.id);
    
    const message = {
      sender: req.user.id,
      senderModel: req.user.role === 'admin' ? 'Admin' : 'User',
      text,
      attachment
    };

    chat.messages.push(message);
    chat.lastMessage = text || 'Attachment';
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(201).json({ status: 'success', data: { message } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
