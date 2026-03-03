import React, { useState, useEffect } from 'react';
import { ThemeType } from './GameContext';

interface FlashlightProps {
  width: number;
  height: number;
  radius: number;
  onMove: (x: number, y: number) => void;
  onTap: (x: number, y: number) => void;
  theme?: ThemeType;
  level?: number;
}

const Flashlight: React.FC<FlashlightProps> = ({ 
  width, 
  height, 
  radius, 
  onMove, 
  onTap,
  theme = 'forest',
  level = 1
}) => {
  const [position, setPosition] = useState({ x: width / 2, y: height / 2 });
  const [isActive, setIsActive] = useState(false);
  const [battery, setBattery] = useState(100);
  const [particles, setParticles] = useState<Array<{
    x: number;
    y: number;
    size: number;
    lifetime: number;
    speed: number;
    angle: number;
  }>>([]);
  
  // Get theme-specific colors for the flashlight
  const getThemeColors = () => {
    switch (theme) {
      case 'forest':
        return {
          primary: 'rgba(220, 255, 220, 0.3)',
          glow: '0 0 20px rgba(100, 255, 100, 0.3)'
        };
      case 'space':
        return {
          primary: 'rgba(180, 180, 255, 0.3)',
          glow: '0 0 20px rgba(100, 100, 255, 0.3)'
        };
      case 'underwater':
        return {
          primary: 'rgba(150, 220, 255, 0.3)',
          glow: '0 0 20px rgba(50, 150, 255, 0.3)'
        };
      case 'desert':
        return {
          primary: 'rgba(255, 230, 150, 0.3)',
          glow: '0 0 20px rgba(255, 200, 50, 0.3)'
        };
      default:
        return {
          primary: 'rgba(255, 255, 255, 0.3)',
          glow: '0 0 20px rgba(255, 255, 255, 0.3)'
        };
    }
  };
  
  const colors = getThemeColors();
  
  // Create energy particles when tapping
  const createParticles = (x: number, y: number) => {
    const newParticles = Array(10).fill(0).map(() => ({
      x,
      y,
      size: Math.random() * 4 + 1,
      lifetime: 1.0,
      speed: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Update particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed,
            lifetime: p.lifetime - 0.05
          }))
          .filter(p => p.lifetime > 0)
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [particles]);
  
  // Battery drain effect for higher levels
  useEffect(() => {
    if (level <= 3) return;
    
    const drainRate = 0.05 * (level * 0.1); // More drain at higher levels
    
    const interval = setInterval(() => {
      if (isActive) {
        setBattery(prev => Math.max(0, prev - drainRate));
      } else {
        setBattery(prev => Math.min(100, prev + drainRate * 0.5)); // Recharge when not active
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive, level]);
  
  // Effect for battery-based flashlight size
  const actualRadius = battery > 0 ? radius * (battery / 100) : 0;
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
    onMove(x, y);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling when using the flashlight
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setPosition({ x, y });
    onMove(x, y);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsActive(true);
    createParticles(x, y);
    onTap(x, y);
    
    // Reset active state after a delay
    setTimeout(() => setIsActive(false), 300);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsActive(true);
    createParticles(position.x, position.y);
    onTap(position.x, position.y);
    
    // Reset active state after a delay
    setTimeout(() => setIsActive(false), 300);
  };
  
  // Create a radial gradient for the flashlight effect
  const flashlightGradient = `radial-gradient(
    circle ${actualRadius}px at ${position.x}px ${position.y}px,
    ${colors.primary} 0%,
    rgba(255, 255, 255, 0.05) 70%,
    transparent 100%
  )`;
  
  return (
    <>
      {/* Dark overlay with flashlight effect */}
      <div 
        className="absolute inset-0 cursor-none touch-none"
        style={{ 
          background: flashlightGradient,
          width: `${width}px`,
          height: `${height}px`
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {/* Energy particles when tapping */}
        {particles.map((particle, i) => (
          <div 
            key={`particle-${i}`}
            className="absolute rounded-full bg-yellow-300"
            style={{
              left: particle.x,
              top: particle.y,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.lifetime,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 3px rgba(255, 255, 0, 0.8)',
              zIndex: 5
            }}
          />
        ))}
        
        {/* Flashlight cursor */}
        <div 
          className={`absolute rounded-full border-2 transition-all ${
            isActive ? 'border-yellow-300 scale-110' : 'border-white border-opacity-50'
          } pointer-events-none`}
          style={{
            left: position.x,
            top: position.y,
            width: `${actualRadius * 2}px`,
            height: `${actualRadius * 2}px`,
            transform: 'translate(-50%, -50%)',
            boxShadow: isActive ? '0 0 15px rgba(255, 255, 0, 0.6)' : colors.glow
          }}
        />
        
        {/* Battery indicator (only visible at higher levels) */}
        {level > 3 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-md">
            <div className="text-xs mb-1 text-gray-300">Battery</div>
            <div className="w-20 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  battery > 60 ? 'bg-green-500' : 
                  battery > 30 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${battery}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Flashlight;