const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat.model');
const { protect, restrictTo } = require('../middleware/auth');

// GET /sessions — admin: list all chat sessions
router.get('/sessions', protect, restrictTo('admin'), async (req, res) => {
  try {
    const sessions = await Chat.find()
      .populate('participants', 'name email avatar')
      .populate('assignedTo', 'name')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: { sessions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /sessions/:id — admin/user: get specific session
router.get('/sessions/:id', protect, async (req, res) => {
  try {
    const session = await Chat.findById(req.params.id)
      .populate('participants', 'name email avatar')
      .populate('assignedTo', 'name');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: { session } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /sessions/:id/messages — admin/user: get messages
router.get('/sessions/:id/messages', protect, async (req, res) => {
  try {
    const session = await Chat.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, data: { messages: session.messages } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /sessions/:id/messages — admin/user: send message
router.post('/sessions/:id/messages', protect, async (req, res) => {
  try {
    const { content, type = 'text' } = req.body;
    const session = await Chat.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const message = {
      sender: req.user.id,
      senderRole: req.user.role,
      content,
      type
    };

    session.messages.push(message);
    session.updatedAt = Date.now();
    await session.save();

    const io = req.app.get('io');
    io.to(`chat:${session._id}`).emit('chat:message', message);
    
    // Notify admin if user sent message
    if (req.user.role === 'user') {
      io.to('admin').emit('chat:new_message', { sessionId: session._id, message });
    }

    res.json({ success: true, data: { message } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
