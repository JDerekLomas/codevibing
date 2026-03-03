import React, { useState, useEffect } from 'react';
import { ThemeType, getThemeColors } from './GameContext';

interface CoordinateSlidersProps {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  x: number;
  y: number;
  onXChange: (value: number) => void;
  onYChange: (value: number) => void;
  theme?: ThemeType;
  level?: number;
}

const CoordinateSliders: React.FC<CoordinateSlidersProps> = ({
  minX,
  maxX,
  minY,
  maxY,
  x,
  y,
  onXChange,
  onYChange,
  theme = 'forest',
  level = 1
}) => {
  const [xValue, setXValue] = useState(x);
  const [yValue, setYValue] = useState(y);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Get theme-specific colors
  const themeColors = getThemeColors(theme);
  
  // Handle X slider change
  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setXValue(newValue);
    onXChange(newValue);
    
    // Visual transition effect
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 200);
  };
  
  // Handle Y slider change
  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setYValue(newValue);
    onYChange(newValue);
    
    // Visual transition effect
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 200);
  };
  
  // Nudge value buttons (for more precise adjustments)
  const nudgeX = (amount: number) => {
    const newValue = Math.min(maxX, Math.max(minX, xValue + amount));
    setXValue(newValue);
    onXChange(newValue);
  };
  
  const nudgeY = (amount: number) => {
    const newValue = Math.min(maxY, Math.max(minY, yValue + amount));
    setYValue(newValue);
    onYChange(newValue);
  };
  
  // Auto-tune feature (gradually moves to closest integer values)
  useEffect(() => {
    // Only available at higher levels
    if (level < 5) return;
    
    const tuneInterval = setInterval(() => {
      // Get current slider values
      const currentX = xValue;
      const currentY = yValue;
      
      // Calculate closest integer
      const targetX = Math.round(currentX);
      const targetY = Math.round(currentY);
      
      // Gradually adjust towards integer value
      if (currentX !== targetX || currentY !== targetY) {
        const newX = currentX + (targetX - currentX) * 0.1;
        const newY = currentY + (targetY - currentY) * 0.1;
        
        if (Math.abs(newX - targetX) < 0.01) {
          setXValue(targetX);
          onXChange(targetX);
        } else {
          setXValue(newX);
          onXChange(Math.round(newX * 10) / 10);
        }
        
        if (Math.abs(newY - targetY) < 0.01) {
          setYValue(targetY);
          onYChange(targetY);
        } else {
          setYValue(newY);
          onYChange(Math.round(newY * 10) / 10);
        }
      }
    }, 100);
    
    return () => clearInterval(tuneInterval);
  }, [level, xValue, yValue, minX, maxX, minY, maxY, onXChange, onYChange]);
  
  // Calculate width of slider track based on range
  const getTrackWidth = () => {
    return Math.min(window.innerWidth - 100, 400); // Responsive track width
  };
  
  // Add accessibility keyboard controls
  const handleKeyDownX = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      nudgeX(-1);
    } else if (e.key === 'ArrowRight') {
      nudgeX(1);
    }
  };
  
  const handleKeyDownY = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      nudgeY(1);
    } else if (e.key === 'ArrowDown') {
      nudgeY(-1);
    }
  };
  
  // Enable haptic feedback for mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration
    }
  };
  
  // Generate slider ticks
  const generateTicks = (min: number, max: number) => {
    const ticks = [];
    for (let i = min; i <= max; i++) {
      ticks.push(
        <div 
          key={`tick-${i}`} 
          className="absolute w-0.5 h-2 bg-gray-500 transform -translate-x-1/2"
          style={{ 
            left: `${((i - min) / (max - min)) * 100}%`,
            bottom: '-10px'
          }}
        />
      );
    }
    return ticks;
  };
  
  return (
    <div className={`flex flex-col gap-6 w-full max-w-sm p-4 rounded-xl ${themeColors.primary} transition-colors duration-300`}>
      {/* X-axis slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-lg font-bold flex items-center gap-1">
            <span className="text-red-400">X</span>:
          </label>
          
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:bg-gray-600"
              onClick={() => {
                nudgeX(-1);
                triggerHapticFeedback();
              }}
            >
              -
            </button>
            
            <div className={`bg-gray-800 px-3 py-1 rounded-md w-16 text-center font-mono ${isTransitioning ? 'scale-110 text-yellow-300' : ''} transition-all`}>
              {xValue}
            </div>
            
            <button 
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:bg-gray-600"
              onClick={() => {
                nudgeX(1);
                triggerHapticFeedback();
              }}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={minX}
            max={maxX}
            step={level >= 8 ? 0.1 : 1} // Fractional values at higher levels
            value={xValue}
            onChange={handleXChange}
            onKeyDown={handleKeyDownX}
            className={`w-full accent-red-600 h-6 rounded-lg appearance-none bg-gray-800 cursor-pointer`}
            style={{ width: getTrackWidth() }}
            onTouchStart={triggerHapticFeedback}
            onTouchEnd={triggerHapticFeedback}
            aria-label="X-axis position slider"
          />
          
          {/* Slider ticks */}
          <div className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none">
            {generateTicks(minX, maxX)}
          </div>
        </div>
      </div>
      
      {/* Y-axis slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-lg font-bold flex items-center gap-1">
            <span className="text-green-400">Y</span>:
          </label>
          
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:bg-gray-600"
              onClick={() => {
                nudgeY(-1);
                triggerHapticFeedback();
              }}
            >
              -
            </button>
            
            <div className={`bg-gray-800 px-3 py-1 rounded-md w-16 text-center font-mono ${isTransitioning ? 'scale-110 text-yellow-300' : ''} transition-all`}>
              {yValue}
            </div>
            
            <button 
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 active:bg-gray-600"
              onClick={() => {
                nudgeY(1);
                triggerHapticFeedback();
              }}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min={minY}
            max={maxY}
            step={level >= 8 ? 0.1 : 1} // Fractional values at higher levels
            value={yValue}
            onChange={handleYChange}
            onKeyDown={handleKeyDownY}
            className="w-full accent-green-600 h-6 rounded-lg appearance-none bg-gray-800 cursor-pointer"
            style={{ width: getTrackWidth() }}
            onTouchStart={triggerHapticFeedback}
            onTouchEnd={triggerHapticFeedback}
            aria-label="Y-axis position slider"
          />
          
          {/* Slider ticks */}
          <div className="absolute bottom-0 left-0 right-0 h-3 pointer-events-none">
            {generateTicks(minY, maxY)}
          </div>
        </div>
      </div>
      
      {/* Current coordinate readout */}
      <div className="text-center bg-black bg-opacity-60 py-2 px-4 rounded-lg font-mono text-lg">
        ( <span className="text-red-400">{xValue}</span>, <span className="text-green-400">{yValue}</span> )
      </div>
      
      {/* Precision mode for higher levels */}
      {level >= 8 && (
        <div className="text-xs text-center text-gray-400 mt-1">
          Precision Mode: Use +/- buttons for 0.1 increments
        </div>
      )}
    </div>
  );
};

export default CoordinateSliders;