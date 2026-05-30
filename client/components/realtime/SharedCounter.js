import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useSocket } from '../../context/SocketContext';
import Button from '../ui/Button';
export function SharedCounter() {
  const counter = useStore((state) => state.counter);
  const { updateCounter } = useSocket();
  return (
    <div className="glass p-6 rounded-2xl border border-white/5 bg-slate-950/20 text-center flex flex-col items-center justify-center">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Global Collaborative Counter</h3>
      <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
        Increment or decrement this counter. The change updates immediately for all connected users.
      </p>
      <div className="flex items-center gap-6">
        <Button onClick={() => updateCounter(-1)} variant="secondary" className="w-12 h-12 rounded-full !p-0 text-xl font-bold flex items-center justify-center">
          -
        </Button>
        <motion.div
          key={counter}
          initial={{ scale: 0.8, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="text-5xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent w-24 tabular-nums"
        >
          {counter}
        </motion.div>
        <Button onClick={() => updateCounter(1)} variant="primary" className="w-12 h-12 rounded-full !p-0 text-xl font-bold flex items-center justify-center">
          +
        </Button>
      </div>
      <div className="mt-5 flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>Multiplayer Synced</span>
      </div>
    </div>
  );
}
export default SharedCounter;

