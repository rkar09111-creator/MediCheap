import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  description: String,
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  priority: { type: String, enum: ['Low', 'Normal', 'High', 'Urgent'], default: 'Normal' },
  category: String,
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  internalNotes: [{
    text: String,
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
