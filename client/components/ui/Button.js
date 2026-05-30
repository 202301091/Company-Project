import React from 'react';
import { motion } from 'framer-motion';
export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseStyle = "relative px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border border-violet-500/30",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 backdrop-blur-md",
    glow: "bg-slate-900/80 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 shadow-md shadow-cyan-500/10 hover:shadow-cyan-400/20",
    danger: "bg-rose-600/80 hover:bg-rose-500 text-white border border-rose-500/30"
  };
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
export default Button;
