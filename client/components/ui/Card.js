import React from 'react';
import { motion } from 'framer-motion';
export function Card({ children, className = '', glowColor = 'violet', ...props }) {
  const glowStyles = {
    violet: 'group-hover:border-violet-500/30 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]',
    cyan: 'group-hover:border-cyan-500/30 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    emerald: 'group-hover:border-emerald-500/30 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]',
    pink: 'group-hover:border-pink-500/30 group-hover:shadow-[0_0_25px_rgba(236,72,153,0.15)]',
  };
  return (
    <div className={`group relative rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-xl transition-all duration-500 hover:bg-slate-900/40 ${glowStyles[glowColor] || glowStyles.violet} ${className}`} {...props}>
      {/* Dynamic ambient highlight */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
export default Card;
