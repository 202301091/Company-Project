import React from 'react';
import { Terminal } from 'lucide-react';
import { useStore } from '../../store/useStore';
export function ActivityLog() {
  const activities = useStore((state) => state.activities);
  const formatTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (_) {
      return '';
    }
  };
  const getActivityColor = (type) => {
    switch (type) {
      case 'join': return 'text-emerald-400';
      case 'leave': return 'text-rose-400';
      case 'counter': return 'text-cyan-400';
      case 'vote': return 'text-pink-400';
      case 'theme': return 'text-amber-400';
      default: return 'text-violet-400';
    }
  };
  return (
    <div className="glass p-5 rounded-2xl border border-white/5 bg-slate-950/20 w-full h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-violet-400" />
          <h4 className="text-sm font-bold text-gray-200">Space Activity Stream</h4>
        </div>
        <p className="text-[11px] text-gray-400">Live feed logs of collaborator interactions, database saves, and socket operations.</p>
      </div>
      <div className="flex-1 min-h-[140px] max-h-[220px] overflow-y-auto mt-4 p-3 bg-slate-950/70 border border-white/5 rounded-xl font-mono text-[10px] text-gray-400 space-y-2">
        {activities.length === 0 ? (
          <div className="text-gray-600 italic h-full flex items-center justify-center">
            Waiting for workspace events...
          </div>
        ) : (
          activities.map((act, i) => (
            <div key={act._id || i} className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-gray-600 shrink-0">[{formatTime(act.createdAt)}]</span>
              <span className="font-semibold text-gray-300 shrink-0 uppercase tracking-wider text-[8px] border border-white/5 px-1 rounded bg-white/[0.01]">
                {act.type}
              </span>
              <span className="flex-1 break-all">
                <span className="text-gray-200 font-bold">{act.username}</span>{' '}
                <span className={getActivityColor(act.type)}>{act.action}</span>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default ActivityLog;
