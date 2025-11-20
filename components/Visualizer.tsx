import React from 'react';
import { Board } from '../types';

interface VisualizerProps {
  board: Board;
  kerf: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({ board, kerf }) => {
  const { width, height, placedPieces, freeRects } = board;

  const maxDim = Math.max(width, height);
  const baseFontSize = Math.max(14, maxDim / 60); 
  const strokeWidth = Math.max(1, maxDim / 1200);

  const renderDimensions = (x: number, y: number, w: number, h: number, color: string) => {
    const showW = w > baseFontSize * 1.5;
    const showH = h > baseFontSize * 1.5;
    
    if (!showW && !showH) return null;

    return (
      <>
        {showW && (
          <text
            x={x + w / 2}
            y={y + baseFontSize} 
            textAnchor="middle"
            fontSize={baseFontSize}
            fontWeight="500"
            fill={color}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {Math.round(w).toLocaleString()}
          </text>
        )}
        {showH && (
          <text
            x={x + baseFontSize * 0.8}
            y={y + h / 2}
            textAnchor="middle"
            fontSize={baseFontSize}
            fontWeight="500"
            fill={color}
            transform={`rotate(-90, ${x + baseFontSize * 0.8}, ${y + h / 2})`}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {Math.round(h).toLocaleString()}
          </text>
        )}
      </>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 print:break-inside-avoid">
      <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Placa {board.id}
        </h3>
        <div className="flex items-center gap-3">
             <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                {board.efficiency.toFixed(1)}% Uso
             </span>
             <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                {board.waste.toFixed(1)}% Libre
             </span>
             <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded ml-2">
              {width} x {height}
            </span>
        </div>
      </div>
      
      <div className="relative w-full bg-white rounded border border-gray-200 overflow-hidden flex items-center justify-center print:border-gray-800">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block"
          style={{ maxHeight: '600px', fontFamily: 'sans-serif' }}
        >
          {}
          <rect x="0" y="0" width={width} height={height} fill="#ffffff" />

          {}
          {freeRects.map((rect, i) => {
             if (rect.w < 5 || rect.h < 5) return null;
             return (
               <g key={`waste-${i}`}>
                 <rect
                   x={rect.x}
                   y={rect.y}
                   width={rect.w}
                   height={rect.h}
                   fill="#f3f4f6" 
                   stroke="#e5e7eb"
                   strokeWidth={strokeWidth}
                 />
                 {renderDimensions(rect.x, rect.y, rect.w, rect.h, "#9ca3af")}
               </g>
             );
          })}

          {}
          {placedPieces.map((p) => (
            <g key={p.id}>
              <rect
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                fill={p.color}
                stroke="#374151" 
                strokeWidth={strokeWidth}
                opacity="0.9"
              />
               {renderDimensions(p.x, p.y, p.w, p.h, "#1f2937")}
            </g>
          ))}
          
          {}
          <rect x="0" y="0" width={width} height={height} fill="none" stroke="#d1d5db" strokeWidth={strokeWidth * 2} />
        </svg>
      </div>
    </div>
  );
};