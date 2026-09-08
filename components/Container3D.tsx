import React from 'react';
import { LoadedItem } from './SmartLogisticsTool';

interface Container3DProps {
  items: LoadedItem[];
  containerType: '20ft' | '40ft';
}

const Container3D: React.FC<Container3DProps> = ({ items, containerType }) => {
  // Container inner dimensions in meters
  const containerDim = containerType === '20ft' 
    ? { l: 5.9, w: 2.35, h: 2.39 } 
    : { l: 12.03, w: 2.35, h: 2.39 };

  const containerVolume = containerDim.l * containerDim.w * containerDim.h;
  const totalLoadedVolume = items.reduce((sum, item) => sum + item.volume, 0);
  const totalCartons = items.reduce((sum, item) => sum + item.cartons, 0);

  const fillPercentage = containerVolume > 0 ? Math.min(100, (totalLoadedVolume / containerVolume) * 100) : 0;
  const isOverflow = totalLoadedVolume > containerVolume;

  // Dynamic Isometric Coordinates based on Container Type
  const is40ft = containerType === '40ft';
  const W = is40ft ? 30 : 40;
  const L = is40ft ? 130 : 100;
  const H = is40ft ? 30 : 40;
  const originX = is40ft ? 45 : 60;
  const originY = 110;

  const P0 = { x: originX, y: originY };
  const P1 = { x: originX - W, y: originY - W/2 };
  const P3 = { x: originX + L, y: originY - L/2 };
  const P2 = { x: P3.x - W, y: P3.y - W/2 };

  const T0 = { x: P0.x, y: P0.y - H };
  const T1 = { x: P1.x, y: P1.y - H };
  const T2 = { x: P2.x, y: P2.y - H };
  const T3 = { x: P3.x, y: P3.y - H };

  // Calculate stacking heights for each item
  let currentH = 0;
  const stackedItems = items.map(item => {
    const itemH = H * (item.volume / containerVolume);
    const startH = currentH;
    const endH = currentH + itemH;
    currentH = endH;
    return { ...item, startH, endH, itemH };
  });

  return (
    <div className="w-full h-64 bg-white rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-inner border border-gray-200">
      {/* Container SVG Illustration */}
      <div className="relative w-full max-w-[280px] h-40 mb-4 flex justify-center">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md overflow-visible">
          
          {/* Floor */}
          <path d={`M ${P0.x} ${P0.y} L ${P1.x} ${P1.y} L ${P2.x} ${P2.y} L ${P3.x} ${P3.y} Z`} fill="#f59e0b" />
          <path d={`M ${P0.x} ${P0.y} L ${P3.x} ${P3.y} L ${P3.x} ${P3.y + 3} L ${P0.x} ${P0.y + 3} L ${P1.x} ${P1.y + 3} L ${P1.x} ${P1.y} Z`} fill="#d97706" />

          {/* Back Wireframe Edges */}
          <polyline points={`${P1.x},${T1.y} ${P2.x},${T2.y} ${P3.x},${T3.y}`} fill="none" stroke="#d1d5db" strokeWidth="1.5" opacity="0.6" />
          <line x1={P2.x} y1={T2.y} x2={P2.x} y2={P2.y} stroke="#d1d5db" strokeWidth="1.5" opacity="0.6" />
          <line x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} stroke="#d1d5db" strokeWidth="1.5" opacity="0.6" />
          <line x1={P3.x} y1={P3.y} x2={P2.x} y2={P2.y} stroke="#d1d5db" strokeWidth="1.5" opacity="0.6" />

          {/* Cargo Blocks */}
          {stackedItems.map((item, index) => {
            // Cap the endH at H (max height of the container drawing)
            const drawStartH = Math.min(H, item.startH);
            const drawEndH = Math.min(H, item.endH);
            
            if (drawStartH >= H) return null; // Don't draw if it's completely overflowing the visual box

            return (
              <g key={item.id} className="transition-all duration-1000 ease-out">
                {/* Top Face */}
                <path d={`M ${P0.x} ${P0.y - drawEndH} L ${P1.x} ${P1.y - drawEndH} L ${P2.x} ${P2.y - drawEndH} L ${P3.x} ${P3.y - drawEndH} Z`} fill={item.color.top} />
                {/* Left Face */}
                <path d={`M ${P0.x} ${P0.y - drawStartH} L ${P1.x} ${P1.y - drawStartH} L ${P1.x} ${P1.y - drawEndH} L ${P0.x} ${P0.y - drawEndH} Z`} fill={item.color.left} />
                {/* Right Face */}
                <path d={`M ${P0.x} ${P0.y - drawStartH} L ${P3.x} ${P3.y - drawStartH} L ${P3.x} ${P3.y - drawEndH} L ${P0.x} ${P0.y - drawEndH} Z`} fill={item.color.right} />

                {/* Grid Lines - Left Face */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const frac = (i + 1) / 6;
                  const x = P1.x + frac * (P0.x - P1.x);
                  const yTopLine = (P1.y - drawEndH) + frac * (P0.y - P1.y);
                  const yBotLine = (P1.y - drawStartH) + frac * (P0.y - P1.y);
                  return <line key={`l-v-${i}`} x1={x} y1={yTopLine} x2={x} y2={yBotLine} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.5" />;
                })}
                {Array.from({ length: Math.max(0, Math.floor((drawEndH - drawStartH) / 8)) }).map((_, i) => {
                  const yOffset = drawStartH + (i + 1) * 8;
                  return <line key={`l-h-${i}`} x1={P1.x} y1={P1.y - yOffset} x2={P0.x} y2={P0.y - yOffset} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.5" />;
                })}

                {/* Grid Lines - Right Face */}
                {Array.from({ length: is40ft ? 9 : 6 }).map((_, i) => {
                  const steps = is40ft ? 10 : 7;
                  const frac = (i + 1) / steps;
                  const x = P0.x + frac * (P3.x - P0.x);
                  const yTopLine = (P0.y - drawEndH) + frac * (P3.y - P0.y);
                  const yBotLine = (P0.y - drawStartH) + frac * (P3.y - P0.y);
                  return <line key={`r-v-${i}`} x1={x} y1={yTopLine} x2={x} y2={yBotLine} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.5" />;
                })}
                {Array.from({ length: Math.max(0, Math.floor((drawEndH - drawStartH) / 8)) }).map((_, i) => {
                  const yOffset = drawStartH + (i + 1) * 8;
                  return <line key={`r-h-${i}`} x1={P0.x} y1={P0.y - yOffset} x2={P3.x} y2={P3.y - yOffset} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.5" />;
                })}

                {/* Grid Lines - Top Face */}
                {Array.from({ length: is40ft ? 9 : 6 }).map((_, i) => {
                  const steps = is40ft ? 10 : 7;
                  const frac = (i + 1) / steps;
                  const x1 = P1.x + frac * (P2.x - P1.x);
                  const y1 = (P1.y - drawEndH) + frac * (P2.y - P1.y);
                  const x2 = P0.x + frac * (P3.x - P0.x);
                  const y2 = (P0.y - drawEndH) + frac * (P3.y - P0.y);
                  return <line key={`t-1-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.5" />;
                })}
                {Array.from({ length: 5 }).map((_, i) => {
                  const frac = (i + 1) / 6;
                  const x1 = P1.x + frac * (P0.x - P1.x);
                  const y1 = (P1.y - drawEndH) + frac * (P0.y - P1.y);
                  const x2 = P2.x + frac * (P3.x - P2.x);
                  const y2 = (P2.y - drawEndH) + frac * (P3.y - P2.y);
                  return <line key={`t-2-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.5" />;
                })}

                {/* Optional: Add a subtle separator line between blocks */}
                {index > 0 && (
                  <>
                    <line x1={P1.x} y1={P1.y - drawStartH} x2={P0.x} y2={P0.y - drawStartH} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
                    <line x1={P0.x} y1={P0.y - drawStartH} x2={P3.x} y2={P3.y - drawStartH} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
                  </>
                )}
              </g>
            );
          })}

          {/* Front Wireframe Edges */}
          <polyline points={`${P1.x},${T1.y} ${P1.x},${P1.y} ${P0.x},${P0.y} ${P3.x},${P3.y} ${P3.x},${T3.y}`} fill="none" stroke="#e5e7eb" strokeWidth="2" opacity="0.9" />
          <line x1={P0.x} y1={P0.y} x2={P0.x} y2={T0.y} stroke="#e5e7eb" strokeWidth="2" opacity="0.9" />
          <polyline points={`${P1.x},${T1.y} ${P0.x},${T0.y} ${P3.x},${T3.y}`} fill="none" stroke="#e5e7eb" strokeWidth="2" opacity="0.9" />

          {/* Corner Posts */}
          <line x1={P1.x} y1={T1.y} x2={P1.x} y2={P1.y} stroke="#d1d5db" strokeWidth="3" opacity="1" />
          <line x1={P0.x} y1={T0.y} x2={P0.x} y2={P0.y} stroke="#d1d5db" strokeWidth="3" opacity="1" />
          <line x1={P3.x} y1={T3.y} x2={P3.x} y2={P3.y} stroke="#d1d5db" strokeWidth="3" opacity="1" />
        </svg>

        {/* Fill Percentage Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-3 py-1.5 rounded-lg text-xs border border-gray-200 shadow-lg transform -translate-y-4">
            <span className={isOverflow ? 'text-red-500' : 'text-primary-600'}>{fillPercentage.toFixed(1)}%</span> Full
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs z-10 mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
          <span>0m³</span>
          <span className="text-gray-500">{containerVolume.toFixed(1)}m³ max</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 border border-gray-200 overflow-hidden shadow-inner relative flex">
          {stackedItems.map((item, index) => {
            const itemPercentage = (item.volume / containerVolume) * 100;
            return (
              <div 
                key={item.id}
                className="h-full transition-all duration-1000 ease-out relative overflow-hidden" 
                style={{ width: `${itemPercentage}%`, backgroundColor: item.color.hex }}
              >
                {/* Shimmer effect */}
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}></div>
              </div>
            );
          })}
          {isOverflow && (
            <div className="h-full bg-red-500 transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (totalLoadedVolume / containerVolume) * 100) - fillPercentage}%` }}></div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center z-10">
        <div className="text-gray-600 text-sm font-medium">
          <span className={`font-bold text-lg ${isOverflow ? 'text-red-500' : 'text-gray-900'}`}>{totalLoadedVolume.toFixed(2)}m³</span> 
          <span className="text-gray-400 mx-1">/</span> 
          {containerVolume.toFixed(2)}m³ loaded
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {totalCartons.toLocaleString()} total cartons
        </div>
        {isOverflow && (
          <div className="text-red-600 text-xs mt-2 font-bold bg-red-50 border border-red-100 inline-block px-3 py-1 rounded-full shadow-sm">
            Overflow: {(totalLoadedVolume - containerVolume).toFixed(2)}m³ over capacity
          </div>
        )}
      </div>
    </div>
  );
};

export default Container3D;
