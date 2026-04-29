import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  Send, 
  Smile, 
  Paperclip, 
  User, 
  Clock, 
  CheckCheck, 
  ChevronRight,
  Zap,
  ShieldCheck,
  History,
  Package,
  ExternalLink,
  Filter,
  X,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { chatService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const SupportChat = () => {
  const { user } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchChats();
    
    // Socket Initialization
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join', 'admin');
    });

    socketRef.current.on('new_chat_message', (data) => {
      if (activeChat?._id === data.chatId) {
        setMessages(prev => [...prev, data]);
      }
      fetchChats(); // Refresh list to show last message
    });

    return () => socketRef.current.disconnect();
  }, [activeChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const { data } = await chatService.getAll();
      setChats(data.data.sessions);
    } catch (error) {
      console.error('Failed to fetch communications buffer');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    setLoading(true);
    try {
      const { data } = await chatService.getById(chat._id);
      setMessages(data.data.session.messages);
      socketRef.current.emit('join', `chat_${chat._id}`);
    } catch (error) {
      toast.error('Unable to establish secure channel');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const payload = {
      chatId: activeChat._id,
      senderId: user._id,
      text: inputText,
      senderName: user.name,
      createdAt: new Date()
    };

    try {
      // Optimistic Update
      setMessages(prev => [...prev, payload]);
      setInputText('');
      
      // Persist
      await chatService.sendMessage(activeChat._id, { content: inputText });
      
      // Socket Broadcast
      socketRef.current.emit('chat:message', payload);
    } catch (error) {
      toast.error('Transmission failed.');
    }
  };

  const filteredChats = chats.filter(c => 
    c.participants?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.messages?.[c.messages.length - 1]?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 pb-6">
      {/* LEFT: CHANNEL LIST */}
      <div className="w-[400px] flex flex-col bg-white rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-neutral-50 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Comms Hub.</h2>
            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">Personnel Interaction Matrix</p>
          </div>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-brand-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Personnel or Intel..." 
              className="w-full pl-14 pr-6 py-4 bg-neutral-50 border-none rounded-2xl text-xs font-black focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {loading && chats.length === 0 ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-brand-primary" /></div>
          ) : filteredChats.map((chat) => (
            <div 
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`p-6 mx-4 my-2 rounded-3xl flex items-center gap-4 cursor-pointer transition-all ${activeChat?._id === chat._id ? 'bg-neutral-900 text-white shadow-elite scale-[1.02]' : 'hover:bg-neutral-50'}`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${activeChat?._id === chat._id ? 'bg-brand-primary text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                  {chat.participants?.[0]?.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${activeChat?._id === chat._id ? 'border-neutral-900' : 'border-white'} ${chat.status === 'Active' ? 'bg-green-500' : 'bg-neutral-300'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-black truncate tracking-tight ${activeChat?._id === chat._id ? 'text-white' : 'text-neutral-900'}`}>{chat.participants?.[0]?.name}</span>
                  <span className="text-[9px] font-black uppercase opacity-40">{new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className={`text-[11px] truncate font-bold ${activeChat?._id === chat._id ? 'text-white/60' : 'text-neutral-400'}`}>{chat.messages?.[chat.messages.length - 1]?.content || 'Channel established'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: SECURE CHANNEL */}
      <div className="flex-1 flex flex-col bg-white rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden relative">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-8 border-b border-neutral-50 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-neutral-900 text-brand-primary rounded-2xl flex items-center justify-center font-black">
                  {activeChat.participants?.[0]?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900 tracking-tight">{activeChat.participants?.[0]?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Secure Link Established</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-neutral-900 hover:text-white transition-all shadow-sm"><Phone size={18} /></button>
                <button className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-neutral-900 hover:text-white transition-all shadow-sm"><Video size={18} /></button>
                <div className="w-px h-6 bg-neutral-100 mx-2" />
                <button className="p-3 bg-neutral-50 text-neutral-400 rounded-xl hover:bg-neutral-900 hover:text-white transition-all shadow-sm"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-neutral-50/30 no-scrollbar">
              {messages.map((msg, i) => {
                const isAdmin = msg.senderModel === 'Admin' || msg.sender?._id === user._id;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    key={i} 
                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] space-y-2 ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className={`p-6 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${isAdmin ? 'bg-neutral-900 text-white rounded-tr-none' : 'bg-white text-neutral-900 border border-neutral-100 rounded-tl-none'}`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isAdmin && <CheckCheck size={12} className="text-brand-primary" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white border-t border-neutral-50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-neutral-50 p-3 pl-6 rounded-[2rem] border border-neutral-100 group focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-primary/10 transition-all">
                <button type="button" className="text-neutral-300 hover:text-neutral-900 transition-colors"><Smile size={20} /></button>
                <input 
                  type="text" 
                  placeholder="Inscribe response protocol..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold h-12"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="button" className="text-neutral-300 hover:text-neutral-900 transition-colors"><Paperclip size={20} /></button>
                <button type="submit" className="w-12 h-12 bg-neutral-900 text-brand-primary rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                  <Send size={20} />
                </button>
              </form>
              <div className="flex items-center gap-4 mt-6">
                <span className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.3em]">Quick Responses:</span>
                {['Dispatch Confirmed', 'Validation Required', 'Network Delay'].map(tag => (
                  <button key={tag} onClick={() => setInputText(tag)} className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-[10px] font-black text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all">{tag}</button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-32 h-32 bg-neutral-50 rounded-[3rem] flex items-center justify-center mb-10 shadow-inner">
              <MessageSquare size={50} className="text-neutral-200" />
            </div>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Channel Idle.</h3>
            <p className="text-sm text-neutral-400 font-bold max-w-xs leading-relaxed uppercase tracking-widest mt-4">Select a personnel node from the left matrix to initiate secure communication.</p>
          </div>
        )}
      </div>

      {/* RIGHT: INTEL PANEL */}
      <AnimatePresence>
        {activeChat && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }} animate={{ width: 450, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            className="flex flex-col bg-white rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden"
          >
            <div className="p-12 space-y-12 overflow-y-auto no-scrollbar">
              {/* Personnel ID */}
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-[2.5rem] bg-neutral-900 text-brand-primary flex items-center justify-center text-5xl font-black shadow-elite mb-8 relative">
                  {activeChat.participants?.[0]?.name.charAt(0)}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <h4 className="text-2xl font-black text-neutral-900 tracking-tighter">{activeChat.participants?.[0]?.name}</h4>
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.3em] mt-3">Personnel Registry Since 2024</p>
                
                <div className="flex gap-3 mt-8">
                  <span className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Tier 1 Elite</span>
                  <span className="px-5 py-2 bg-brand-600/10 text-brand-primary rounded-xl text-[9px] font-black uppercase tracking-widest">Verified Unit</span>
                </div>
              </div>

              {/* Mission History */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Operations Log</h5>
                  <History size={16} className="text-neutral-200" />
                </div>
                <div className="space-y-4">
                  {[
                    { id: 'OPS-9921', status: 'In-Transit', val: '₹1,240', color: 'text-blue-500' },
                    { id: 'OPS-8842', status: 'Successful', val: '₹420', color: 'text-green-500' },
                  ].map((log, i) => (
                    <div key={i} className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 flex items-center justify-between group hover:border-brand-primary transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 bg-white rounded-2xl ${log.color} shadow-sm`}><Package size={18} /></div>
                        <div>
                          <p className="text-xs font-black text-neutral-900 tracking-tight">{log.id}</p>
                          <p className="text-[9px] font-black text-neutral-400 uppercase mt-1">{log.status}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-neutral-900">{log.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-neutral-900 rounded-[2rem] text-white">
                  <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Total Yield</p>
                  <p className="text-xl font-black tracking-tighter">₹18.4k</p>
                </div>
                <div className="p-6 bg-neutral-50 border border-neutral-100 rounded-[2rem]">
                  <p className="text-[9px] font-black text-neutral-300 uppercase tracking-widest mb-1">Trust Index</p>
                  <p className="text-xl font-black tracking-tighter text-neutral-900">98.4%</p>
                </div>
              </div>

              {/* Action Vector */}
              <div className="pt-10 border-t border-neutral-100 space-y-4">
                <button className="w-full py-5 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-elite hover:scale-105 transition-all">
                  <ExternalLink size={16} /> Open Dossier
                </button>
                <button className="w-full py-5 border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                  Terminate Channel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportChat;
