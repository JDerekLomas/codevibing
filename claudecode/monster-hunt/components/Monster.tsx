import React, { useEffect, useState } from 'react';

export interface MonsterType {
  id: string;
  emoji: string;
  x: number;
  y: number;
  isVisible?: boolean;
  isCaptured?: boolean;
  size?: number;
  rarity?: 'common' | 'rare';
  moves?: {
    speedX?: number;
    speedY?: number;
    pathRadius?: number;
  };
}

interface MonsterProps {
  monster: MonsterType;
  gridSize: number;
  originX: number;
  originY: number;
  onClick?: () => void;
}

const Monster: React.FC<MonsterProps> = ({ 
  monster, 
  gridSize, 
  originX, 
  originY, 
  onClick 
}) => {
  // Convert grid coordinates to pixel coordinates
  const pixelX = originX + (monster.x * gridSize);
  const pixelY = originY - (monster.y * gridSize);
  
  // Particle effect for rare monsters
  const [particles, setParticles] = useState<{ x: number, y: number, size: number, lifetime: number }[]>([]);
  
  // Create particles for rare monsters
  useEffect(() => {
    if (monster.rarity !== 'rare' || !monster.isVisible) return;
    
    const interval = setInterval(() => {
      // Create new particle
      const newParticle = {
        x: Math.random() * 40 - 20, // Random position around monster
        y: Math.random() * 40 - 20,
        size: Math.random() * 3 + 1,
        lifetime: 1.0 // Lifetime from 0.0 to 1.0
      };
      
      // Add new particle and update existing ones
      setParticles(prev => [
        ...prev.map(p => ({ ...p, lifetime: p.lifetime - 0.05 })).filter(p => p.lifetime > 0),
        newParticle
      ]);
    }, 200);
    
    return () => clearInterval(interval);
  }, [monster.rarity, monster.isVisible]);
  
  // Animation for when monster is captured
  const [captureAnimation, setCaptureAnimation] = useState(false);
  
  useEffect(() => {
    if (monster.isCaptured) {
      setCaptureAnimation(true);
    }
  }, [monster.isCaptured]);
  
  // Monster size based on rarity or provided size
  const monsterSize = monster.size || (monster.rarity === 'rare' ? 1.5 : 1);
  
  return (
    <>
      {/* Particles for rare monsters */}
      {monster.rarity === 'rare' && monster.isVisible && particles.map((particle, i) => (
        <div 
          key={`${monster.id}-particle-${i}`}
          className="absolute rounded-full bg-yellow-300"
          style={{
            left: `${pixelX + particle.x}px`,
            top: `${pixelY + particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.lifetime,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 3px rgba(255, 255, 100, 0.8)',
            zIndex: 5
          }}
        />
      ))}
      
      {/* Monster */}
      <div 
        className={`absolute transition-all duration-300 transform ${
          monster.isCaptured && captureAnimation
            ? 'scale-150 -translate-y-20 opacity-0'
            : monster.isCaptured
              ? 'scale-0 opacity-0'
              : monster.isVisible 
                ? 'scale-100 opacity-100' 
                : 'scale-0 opacity-0'
        }`}
        style={{
          left: `${pixelX}px`,
          top: `${pixelY}px`,
          fontSize: `${monsterSize * 2}rem`,
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
          zIndex: 10,
          filter: monster.rarity === 'rare' ? 'drop-shadow(0 0 5px rgba(255, 255, 100, 0.8))' : undefined
        }}
        onClick={onClick}
        onAnimationEnd={() => {
          if (captureAnimation) {
            setCaptureAnimation(false);
          }
        }}
      >
        {monster.emoji}
      </div>
      
      {/* Coordinate display for visible monsters (in slider mode) */}
      {monster.isVisible && !monster.isCaptured && (
        <div 
          className="absolute bg-black bg-opacity-70 px-2 py-1 rounded-md text-xs"
          style={{
            left: `${pixelX}px`,
            top: `${pixelY + 25}px`,
            transform: 'translate(-50%, 0)',
            zIndex: 10
          }}
        >
          ({monster.x}, {monster.y})
        </div>
      )}
    </>
  );
};

export default Monster;