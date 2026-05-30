import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
const REACTION_EMOJIS = ['🚀','🔥','⚡','✨','🧠','🤝','💡','🎯','👏','🌐'];
export function ReactionBlaster() {
  const { sendReaction } = useSocket();
  const [floatingReactions, setFloatingReactions] = useState([]);
  useEffect(() => {

    const handleReactionReceive = (e) => {
      const { id, username, color, emoji } = e.detail;

      const newReaction = {
        id,
        emoji,
        username,
        color,
        x: 10 + Math.random() * 80,
        delay: Math.random() * 0.2
      };
      setFloatingReactions((prev) => [...prev, newReaction]);
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
      }, 4000);
    };

    window.addEventListener('reaction:receive_custom', handleReactionReceive);
    
    // Register mapping in socket connection fallback hook
    const socketReceiveEvent = (e) => {
      window.dispatchEvent(new CustomEvent('reaction:receive_custom', { detail: e }));
    };
    
    window.addEventListener('socket:reaction_broadcast', socketReceiveEvent);
    return () => {
      window.removeEventListener('reaction:receive_custom', handleReactionReceive);
      window.removeEventListener('socket:reaction_broadcast', socketReceiveEvent);
    };
  }, []);
  return (
    <>

      <div className="glass p-5 rounded-2xl border border-white/5 bg-slate-950/20 flex flex-col justify-between h-full">
        <div>
          <h4 className="text-sm font-bold text-gray-200">Shared Reactions</h4>
          <p className="text-[11px] text-gray-400 mt-1">Blast emojis to the viewport of every connected active user instantly.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 mt-5">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                sendReaction(emoji);

                window.dispatchEvent(new CustomEvent('reaction:receive_custom', {
                  detail: {
                    id: Math.random().toString(),
                    username: 'You',
                    color: '#fff',
                    emoji
                  }
                }));
              }}
              className="px-4 py-2 text-xl rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingReactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ y: '100vh', x: `${r.x}vw`, opacity: 0.9, scale: 0.8 }}
              animate={{ 
                y: '-10vh', 
                x: `${r.x + (Math.random() * 20 - 10)}vw`,
                opacity: 0,
                scale: 1.5,
                rotate: Math.random() * 90 - 45
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, ease: 'easeOut', delay: r.delay }}
              className="absolute flex flex-col items-center gap-1 text-center"
            >
              <span className="text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">{r.emoji}</span>
              
              <span 
                style={{ color: r.color || '#fff' }} 
                className="text-[9px] font-bold uppercase tracking-widest bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/10 shadow-md backdrop-blur-sm"
              >
                {r.username}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
export default ReactionBlaster;