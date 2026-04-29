import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, ShieldCheck, Loader2 } from 'lucide-react';
import { Button, cn } from '../ui';
import { io } from 'socket.io-client';
import { chatService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const SupportChat = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your clinical assistant. How can I help you today?", isBot: true, createdAt: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const socketRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen && isAuthenticated) {
            initChat();
        }
    }, [isOpen, isAuthenticated]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const initChat = async () => {
        setLoading(true);
        try {
            // Check if there's an active session
            const { data } = await chatService.getAll(); // User's own sessions
            const activeSession = data.data.sessions[0];
            
            if (activeSession) {
                setSessionId(activeSession._id);
                setMessages(activeSession.messages.map(m => ({
                    text: m.text,
                    isBot: m.senderModel === 'Admin',
                    createdAt: m.createdAt
                })));
            } else {
                // Create new session
                // The backend creates it on first message or manually
            }

            // Socket init
            if (!socketRef.current) {
                socketRef.current = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
                    withCredentials: true
                });

                socketRef.current.on('new_chat_message', (data) => {
                    if (data.chatId === sessionId) {
                        setMessages(prev => [...prev, {
                            text: data.text,
                            isBot: data.senderModel === 'Admin',
                            createdAt: data.createdAt
                        }]);
                    }
                });
            }
        } catch (error) {
            console.error('Channel initialization failure');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !isAuthenticated) return;

        const text = input;
        setInput('');

        try {
            // Optimistic update
            const newMsg = { text, isBot: false, createdAt: new Date() };
            setMessages(prev => [...prev, newMsg]);

            if (!sessionId) {
                // Initial session creation should be handled by backend
                // For now, assume a session exists or is created on POST /messages
            }

            const { data } = await chatService.sendMessage(sessionId || 'new', { text });
            if (!sessionId) setSessionId(data.data.session._id);

            // Broadcast via socket
            socketRef.current.emit('chat:message', {
                chatId: sessionId || data.data.session._id,
                text,
                senderId: user._id,
                senderName: user.name
            });

        } catch (error) {
            console.error('Transmission fault');
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            {isOpen ? (
                <div className="w-[380px] bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                    {/* Header */}
                    <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Clinical Support</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pharmacist Online</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-50/50 scroll-smooth">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                            <div key={i} className={cn(
                                "flex gap-3 max-w-[85%]",
                                msg.isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                                    msg.isBot ? "bg-white text-primary border border-slate-100" : "bg-primary text-white"
                                )}>
                                    {msg.isBot ? <ShieldCheck size={14} /> : <User size={14} />}
                                </div>
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-soft",
                                    msg.isBot ? "bg-white text-text-primary rounded-tl-none border border-slate-100" : "bg-primary text-white rounded-tr-none"
                                )}>
                                    {msg.text}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your clinical query..." 
                            className="flex-1 bg-slate-50 border-none rounded-xl px-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                        <Button type="submit" size="sm" className="h-10 w-10 p-0 rounded-xl">
                            <Send size={18} />
                        </Button>
                    </form>
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-premium hover:scale-110 transition-all group relative"
                >
                    <MessageSquare size={28} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 border-4 border-white rounded-full"></span>
                </button>
            )}
        </div>
    );
};

export default SupportChat;
