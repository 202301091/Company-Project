import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useThrottle } from '../../hooks/useThrottle';

export function CursorOverlay() {
  const cursors = useStore((state) => state.cursors);

  const throttledCursors = useThrottle((value) => value, 30);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {Object.keys(cursors).map((socketId) => {
          const cursor = throttledCursors(cursors[socketId]) || cursors[socketId];

          const { username, color, x, y } = cursor;

          if (x === undefined || y === undefined) return null;

          return (
            <motion.div
              key={socketId}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: 1,
                scale: 1,
                left: x,
                top: y
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 250
              }}
              style={{
                position: 'fixed',
                pointerEvents: 'none'
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: 'translate(-2px, -2px)',
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))'
                }}
              >
                <path
                  d="M5.65376 12.3825L19.5602 4.90805C20.4776 4.41499 21.5034 5.30907 21.1448 6.2913L15.3512 22.1158C14.9961 23.0858 13.626 23.0788 13.2809 22.1051L10.596 14.5323L3.89674 10.7423C2.98393 10.2259 3.03666 8.8778 3.98591 8.43577L5.65376 12.3825Z"
                  fill={color || '#a78bfa'}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  backgroundColor: color || '#a78bfa'
                }}
                className="ml-4 mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-950 uppercase tracking-wider shadow-lg flex items-center gap-1 select-none border border-white/20 whitespace-nowrap"
              >
                <span>{username || 'Anonymous'}</span>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default CursorOverlay;