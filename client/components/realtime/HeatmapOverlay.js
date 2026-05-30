import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useThrottle } from '../../hooks/useThrottle';

export function HeatmapOverlay() {
  const [active, setActive] = useState(false);

  const cursors = useStore((state) => state.cursors);
  const heatmapPoints = useStore((state) => state.heatmapPoints);
  const addHeatmapPoint = useStore((state) => state.addHeatmapPoint);
  const clearOldHeatmapPoints = useStore((state) => state.clearOldHeatmapPoints);

  const throttledAddPoint = useThrottle((cursor) => {
    addHeatmapPoint({
      x: cursor.x,
      y: cursor.y,
      color: cursor.color
    });
  }, 120);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      Object.values(cursors).forEach((cursor) => {
        if (cursor.x && cursor.y) {
          throttledAddPoint(cursor);
        }
      });

      clearOldHeatmapPoints();
    }, 100);

    return () => clearInterval(interval);
  }, [cursors, active, throttledAddPoint, clearOldHeatmapPoints]);

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => setActive(!active)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xl transition-all duration-300 ${
            active
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-slate-900/60 text-emerald-400 border-emerald-500/30 hover:border-emerald-400 hover:bg-slate-900/80'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              active ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'
            }`}
          />

          {active ? 'Disable Heatmap' : 'Enable Live Heatmap'}
        </button>
      </div>

      {active && (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen opacity-70">
          {heatmapPoints.map((point) => {
            const age = Date.now() - point.age;
            const opacity = Math.max(0, 1 - age / 15000);

            return (
              <div
                key={point.id}
                style={{
                  position: 'fixed',
                  left: point.x,
                  top: point.y,
                  width: '90px',
                  height: '90px',
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, ${
                    point.color || '#a78bfa'
                  }50 0%, ${point.color || '#a78bfa'}00 70%)`,
                  borderRadius: '50%',
                  opacity,
                  pointerEvents: 'none',
                  transition: 'opacity 0.2s linear'
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default HeatmapOverlay;