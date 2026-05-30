import React from 'react';
import { Cpu, Users, Eye, Zap, MessageSquare, ShieldAlert } from 'lucide-react';
import Card from '../ui/Card';
export function Features() {
  const featureList = [
    {
      title: "Real-Time Shared Cursor Stream",
      desc: "Synchronize mouse tracks globally. Watch your coworkers move in real-time with latency under 30ms.",
      icon: Eye,
      color: "cyan"
    },
    {
      title: "Multiplayer Drawing Board",
      desc: "An integrated collaborative drawing pad. Clear, sketch, scale, and save canvas drawings collaboratively.",
      icon: Zap,
      color: "emerald"
    },
    {
      title: "Consensus Voting & Polls",
      desc: "Cast feature priority votes and see immediate percentage graphs recalculating across all screens.",
      icon: Users,
      color: "pink"
    },
    {
      title: "Workspace Chat & Streams",
      desc: "Communicate through a global typing indicator panel, shared music playlist, and reaction blasting.",
      icon: MessageSquare,
      color: "violet"
    },
    {
      title: "Secure Identity Cryptography",
      desc: "Guest session tokens are protected via JWT cryptographic authentication maps, keeping sockets secure.",
      icon: ShieldAlert,
      color: "cyan"
    }
  ];
  return (
    <section id="features" className="py-20 max-w-7xl mx-auto px-6 relative scroll-mt-10">
      
      {/* Head */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
          Cooperative Workspaces, <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Supercharged</span>
        </h2>
        <p className="text-sm md:text-base text-gray-400 font-medium mt-4">
          All workspace objects, tools, views, and tracks are fully collaborative. Interact, code, design, and plan with zero sync delays.
        </p>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <Card key={index} glowColor={feat.color} className="p-6">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 w-fit group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-200 mt-5 text-lg group-hover:text-white transition-colors">{feat.title}</h3>
              <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">{feat.desc}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
export default Features;
