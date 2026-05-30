import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useSocket } from '../../context/SocketContext';
export function ThemeSync() {
  const theme = useStore((state) => state.theme);
  const { toggleTheme } = useSocket();
  const themes = [
    { id: 'dark', name: 'Cyber Indigo', icon: Moon, activeClass: 'border-violet-500/50 bg-violet-950/20 text-violet-400' },
    { id: 'light', name: 'Alabaster Light', icon: Sun, activeClass: 'border-amber-500/50 bg-amber-950/20 text-amber-400' },
    { id: 'cyberpunk', name: 'Neon Cyberpunk', icon: Sparkles, activeClass: 'border-pink-500/50 bg-pink-950/20 text-pink-400' }
  ];
  return (
    <div className="glass p-5 rounded-2xl border border-white/5 bg-slate-950/20 flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-gray-200">Global Theme Sync</h4>
        <p className="text-[11px] text-gray-400 mt-1">Changing the active theme updates the design system for all connected clients instantly.</p>
      </div>
      <div className="grid grid-cols-3 gap-2.5 mt-4">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => toggleTheme(t.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-2 transition-all duration-300 cursor-pointer ${
                isActive 
                  ? t.activeClass 
                  : 'border-white/5 bg-white/[0.01] text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] whitespace-nowrap">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default ThemeSync;
