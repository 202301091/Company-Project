import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useSocket } from '../../context/SocketContext';
export function VotingWidget() {
  const votes = useStore((state) => state.votes);
  const { castVote } = useSocket();
  const options = [
    { id: 'collaboration', name: 'Real-Time Collaboration Tools', color: 'from-cyan-500 to-blue-500' },
    { id: 'designer', name: 'AI Drag-and-Drop Designer', color: 'from-pink-500 to-rose-500' },
    { id: 'canvas', name: 'Multiplayer Vector Canvas', color: 'from-emerald-500 to-teal-500' }
  ];
  // Calculate total votes
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  const getPercentage = (count) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };
  return (
    <div className="glass p-6 rounded-2xl border border-white/5 bg-slate-950/20 w-full">
      <div className="mb-5">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 uppercase tracking-wider">
          Community Poll
        </span>
        <h3 className="text-xl font-bold text-gray-200 mt-3">Which feature do you want next?</h3>
        <p className="text-xs text-gray-400 mt-1">Vote in real time. Results update instantly for everyone connected.</p>
      </div>
      <div className="space-y-4">
        {options.map((opt) => {
          const count = votes[opt.id] || 0;
          const percentage = getPercentage(count);
          return (
            <div key={opt.id} className="relative group">
              <button
                onClick={() => castVote(opt.id)}
                className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden flex items-center justify-between z-10 cursor-pointer"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${opt.color} opacity-15 pointer-events-none -z-10`}
                />
                <span className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{opt.name}</span>
                <div className="flex items-center gap-3 font-semibold text-xs text-gray-400">
                  <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-medium">{count} votes</span>
                  <span className="text-gray-200 font-bold w-8 text-right">{percentage}%</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-5 text-right text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
        Total Votes: {totalVotes}
      </div>
    </div>
  );
}
export default VotingWidget;