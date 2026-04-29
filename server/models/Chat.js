import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderModel: { type: String, enum: ['User', 'Admin'], required: true },
  text: String,
  attachment: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastMessage: String,
  status: { type: String, enum: ['Waiting', 'Active', 'Resolved'], default: 'Waiting' },
  unreadCount: { type: Number, default: 0 },
  messages: [messageSchema],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  internalNotes: [{
    text: String,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
