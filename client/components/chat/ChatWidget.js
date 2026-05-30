import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useSocket } from '../../context/SocketContext';
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLocalTyping, setIsLocalTyping] = useState(false);
  
  const messages = useStore((state) => state.messages);
  const typingUsers = useStore((state) => state.typingUsers);
  const activeUsers = useStore((state) => state.activeUsers);
  const me = useStore((state) => state.me);
  const { sendMessage, sendTypingStart, sendTypingStop } = useSocket();
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (!isLocalTyping) {
      setIsLocalTyping(true);
      sendTypingStart();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsLocalTyping(false);
      sendTypingStop();
    }, 1500); 
  };
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
    
    setIsLocalTyping(false);
    sendTypingStop();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const typingList = Object.keys(typingUsers)
    .filter((user) => typingUsers[user] && user !== me?.username);
  return (
    <div id="chat-widget" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Chat Trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center p-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-2xl shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-violet-400/20"
        >
          <MessageSquare className="w-6 h-6" />
          
          {/* Online Counter Badge */}
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500 text-slate-950 border border-slate-950">
            {activeUsers.length}
          </span>
        </button>
      )}
      {/* Expanded Chat Box Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl flex flex-col items-stretch overflow-hidden animate-fade-in">
          
          <div className="px-4 py-3 bg-slate-950/50 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-sm text-gray-200">Global Space Chat</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[11px] text-gray-500">
                <Users className="w-3.5 h-3.5" />
                <span>{activeUsers.length} online</span>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/20">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <span className="text-3xl">💬</span>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3">Lobby is quiet</p>
                <p className="text-[10px] text-gray-600 mt-1 max-w-[200px]">Send a message to break the ice with other online users.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender === me?.username;
                const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                return (
                  <div key={msg._id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    
                    <span className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">
                      {isMe ? 'You' : msg.sender}
                    </span>

                    <div
                      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-violet-600 text-white rounded-tr-none'
                          : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>

                    <span className="text-[9px] text-gray-600 mt-1">{time}</span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {typingList.length > 0 && (
            <div className="px-4 py-1.5 bg-slate-950/40 text-[10px] text-gray-500 italic border-t border-white/5">
              {typingList.join(', ')} {typingList.length > 1 ? 'are' : 'is'} typing...
            </div>
          )}
          
          <form onSubmit={handleSend} className="p-3 bg-slate-950/60 border-t border-white/5 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Send message..."
              className="flex-1 bg-white/5 border border-white/5 focus:border-violet-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
export default ChatWidget;
