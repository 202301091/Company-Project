import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useStore } from '../../store/useStore';
import { useThrottle } from '../../hooks/useThrottle';

import Button from '../ui/Button';
export function SharedCanvas() {
  const canvasRef = useRef(null);
  const { drawOnCanvas, clearCanvas } = useSocket();
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#8b5cf6'); // default violet
  const [brushSize, setBrushSize] = useState(4);
  const lastPos = useRef({ x: 0, y: 0 });
  const colors = [
    { name: 'violet', value: '#8b5cf6' },
    { name: 'cyan', value: '#06b6d4' },
    { name: 'emerald', value: '#10b981' },
    { name: 'pink', value: '#ec4899' },
    { name: 'yellow', value: '#eab308' },
    { name: 'white', value: '#ffffff' }
  ];
  // Helper to draw a single stroke segment on the canvas
  const drawSegment = (ctx, prevX, prevY, currX, currY, color, size) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const handleRemoteStroke = (e) => {
      const stroke = e.detail;
      drawSegment(
        ctx, 
        stroke.prevX, 
        stroke.prevY, 
        stroke.currX, 
        stroke.currY, 
        stroke.color, 
        stroke.size
      );
    };

    const handleRemoteClear = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSyncHistory = (e) => {
      const history = e.detail;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      history.forEach((stroke) => {
        drawSegment(
          ctx, 
          stroke.prevX, 
          stroke.prevY, 
          stroke.currX, 
          stroke.currY, 
          stroke.color, 
          stroke.size
        );
      });
    };
    window.addEventListener('canvas:draw_stroke', handleRemoteStroke);
    window.addEventListener('canvas:clear_canvas', handleRemoteClear);
    window.addEventListener('canvas:sync_history', handleSyncHistory);
    return () => {
      window.removeEventListener('canvas:draw_stroke', handleRemoteStroke);
      window.removeEventListener('canvas:clear_canvas', handleRemoteClear);
      window.removeEventListener('canvas:sync_history', handleSyncHistory);
    };
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };
  const startDrawing = (e) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    lastPos.current = coords;
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const currPos = getCoordinates(e);
    // Draw local stroke
    drawSegment(
      ctx,
      lastPos.current.x,
      lastPos.current.y,
      currPos.x,
      currPos.y,
      brushColor,
      brushSize
    );

    drawOnCanvas({
      prevX: lastPos.current.x,
      prevY: lastPos.current.y,
      currX: currPos.x,
      currY: currPos.y,
      color: brushColor,
      size: brushSize
    });
    lastPos.current = currPos;
  };
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  return (
    <div className="glass p-6 rounded-2xl border border-white/5 bg-slate-950/20 w-full flex flex-col items-stretch">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 uppercase tracking-wider">
            Collaborative Drawing Pad
          </span>
          <h3 className="text-xl font-bold text-gray-200 mt-2">Shared Board</h3>
          <p className="text-xs text-gray-400 mt-0.5">Draw together in real-time. Everything you sketch shows up on all screens.</p>
        </div>
        <Button onClick={clearCanvas} variant="danger" className="text-xs !py-1.5 !px-3 font-semibold">
          Clear Board
        </Button>
      </div>

      <div className="relative border border-white/10 rounded-xl bg-slate-950/80 overflow-hidden cursor-crosshair h-80 sm:h-96">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full block"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-white/5">
        
        {/* Colors Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">Brush Color</span>
          {colors.map((c) => (
            <button
              key={c.name}
              onClick={() => setBrushColor(c.value)}
              style={{ backgroundColor: c.value }}
              className={`w-6 h-6 rounded-full border transition-all hover:scale-110 cursor-pointer ${
                brushColor === c.value 
                  ? 'border-white scale-110 shadow-lg shadow-white/20' 
                  : 'border-transparent opacity-80'
              }`}
              title={c.name}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Brush Size</span>
          <input
            type="range"
            min="1"
            max="12"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-xs font-bold text-gray-300 w-5">{brushSize}px</span>
        </div>
      </div>
    </div>
  );
}
export default SharedCanvas;
