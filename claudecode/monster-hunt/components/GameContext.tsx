import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MonsterType } from './Monster';

// Define the game modes
export type GameMode = 'flashlight' | 'slider';

// Define the difficulty levels (number of quadrants)
export type DifficultyLevel = 1 | 2 | 4;

// Monster emojis for the game
const MONSTER_EMOJIS = ['👾', '👹', '👻', '👽', '🤖', '👿', '👺', '🦖', '🐲', '🐉', '🧟', '🐙', '🦑', '🦕', '🦂', '🕷️', '🐊', '🐍'];

// Theme types
export type ThemeType = 'forest' | 'space' | 'underwater' | 'desert';

// Game context type
interface GameContextType {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  monsters: MonsterType[];
  capturedMonsters: MonsterType[];
  currentMonster: MonsterType | null;
  score: number;
  level: number;
  theme: ThemeType;
  combo: number;
  highScore: number;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  captureMonster: (id: string) => void;
  checkMonsterCaptured: (x: number, y: number, radius: number) => boolean;
  resetGame: () => void;
  nextLevel: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Create a random monster at coordinates based on difficulty
const createRandomMonster = (level: number, difficulty: DifficultyLevel): MonsterType => {
  // Determine coordinate range based on difficulty
  let xRange = Math.min(10 + Math.floor(level / 3), 20);
  let yRange = Math.min(10 + Math.floor(level / 3), 20);
  
  // Determine if coordinates can be negative
  const canBeNegativeX = difficulty >= 2;
  const canBeNegativeY = difficulty === 4;
  
  // Generate random coordinates
  let x = Math.floor(Math.random() * xRange);
  let y = Math.floor(Math.random() * yRange);
  
  // Make coordinates negative based on difficulty
  if (canBeNegativeX && Math.random() > 0.5) {
    x = -x;
  }
  
  if (canBeNegativeY && Math.random() > 0.5) {
    y = -y;
  }

  // Add movement parameters for higher levels
  const moves = level > 5 ? {
    speedX: (Math.random() - 0.5) * 0.1 * Math.min(level / 10, 1),
    speedY: (Math.random() - 0.5) * 0.1 * Math.min(level / 10, 1),
    pathRadius: Math.random() * 2
  } : undefined;
  
  return {
    id: `monster-${Date.now()}-${Math.random()}`,
    emoji: MONSTER_EMOJIS[Math.floor(Math.random() * MONSTER_EMOJIS.length)],
    x,
    y,
    isVisible: false,
    isCaptured: false,
    size: 1 + (Math.random() * 0.5),
    rarity: Math.random() > 0.8 ? 'rare' : 'common',
    moves
  };
};

// Functions to get theme-specific colors and backgrounds
export const getThemeColors = (theme: ThemeType) => {
  switch (theme) {
    case 'forest':
      return {
        primary: 'bg-green-800',
        secondary: 'bg-green-900',
        accent: 'bg-yellow-600',
        gradientFrom: 'from-green-900',
        gradientTo: 'to-green-950',
        borderColor: 'border-green-700'
      };
    case 'space':
      return {
        primary: 'bg-indigo-900',
        secondary: 'bg-purple-900',
        accent: 'bg-blue-600',
        gradientFrom: 'from-indigo-950',
        gradientTo: 'to-purple-950',
        borderColor: 'border-indigo-700'
      };
    case 'underwater':
      return {
        primary: 'bg-blue-800',
        secondary: 'bg-blue-900',
        accent: 'bg-cyan-600',
        gradientFrom: 'from-blue-900',
        gradientTo: 'to-cyan-950',
        borderColor: 'border-blue-700'
      };
    case 'desert':
      return {
        primary: 'bg-amber-800',
        secondary: 'bg-amber-900',
        accent: 'bg-red-600',
        gradientFrom: 'from-amber-900',
        gradientTo: 'to-amber-950',
        borderColor: 'border-amber-700'
      };
    default:
      return {
        primary: 'bg-gray-800',
        secondary: 'bg-gray-900',
        accent: 'bg-purple-600',
        gradientFrom: 'from-gray-900',
        gradientTo: 'to-gray-950',
        borderColor: 'border-gray-700'
      };
  }
};

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameMode, setGameMode] = useState<GameMode>('flashlight');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [monsters, setMonsters] = useState<MonsterType[]>([]);
  const [capturedMonsters, setCapturedMonsters] = useState<MonsterType[]>([]);
  const [currentMonster, setCurrentMonster] = useState<MonsterType | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [theme, setTheme] = useState<ThemeType>('forest');
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lastCaptureTime, setLastCaptureTime] = useState(0);
  
  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('monsterHuntHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);
  
  // Update monsters position for moving monsters
  useEffect(() => {
    if (level <= 5) return;
    
    const interval = setInterval(() => {
      setMonsters(prevMonsters => 
        prevMonsters.map(monster => {
          if (!monster.moves) return monster;
          
          // Apply movement pattern
          const time = Date.now() / 1000;
          const newX = monster.x + (monster.moves.speedX || 0);
          const newY = monster.y + (monster.moves.speedY || 0) + 
                      Math.sin(time) * (monster.moves.pathRadius || 0) * 0.1;
          
          // Keep within bounds based on difficulty
          const bounds = getDifficultyBounds(difficulty);
          const boundedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
          const boundedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));
          
          // Reverse direction if hitting bounds
          const newSpeedX = boundedX !== newX ? 
            -(monster.moves.speedX || 0) : monster.moves.speedX;
          const newSpeedY = boundedY !== newY ? 
            -(monster.moves.speedY || 0) : monster.moves.speedY;
          
          return {
            ...monster,
            x: boundedX,
            y: boundedY,
            moves: {
              ...monster.moves,
              speedX: newSpeedX,
              speedY: newSpeedY
            }
          };
        })
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [level, difficulty]);
  
  // Initialize the game
  useEffect(() => {
    resetGame();
  }, [difficulty]);
  
  // Helper to get coordinate bounds based on difficulty
  const getDifficultyBounds = (diff: DifficultyLevel) => {
    switch (diff) {
      case 1:
        return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
      case 2:
        return { minX: -10, maxX: 10, minY: 0, maxY: 10 };
      case 4:
        return { minX: -10, maxX: 10, minY: -10, maxY: 10 };
      default:
        return { minX: 0, maxX: 10, minY: 0, maxY: 10 };
    }
  };
  
  // Reset the game
  const resetGame = () => {
    // Save high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('monsterHuntHighScore', score.toString());
    }
    
    setMonsters([]);
    setCapturedMonsters([]);
    setScore(0);
    setLevel(1);
    setCombo(0);
    
    // Create first monster
    const newMonster = createRandomMonster(1, difficulty);
    setMonsters([newMonster]);
    setCurrentMonster(newMonster);
  };
  
  // Move to the next level
  const nextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    
    // Set new theme every 5 levels
    if (newLevel % 5 === 0) {
      const themes: ThemeType[] = ['forest', 'space', 'underwater', 'desert'];
      const currentIndex = themes.indexOf(theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex]);
    }
    
    // Create new monster(s)
    const monsterCount = Math.min(Math.ceil(newLevel / 3), 3);
    const newMonsters = Array(monsterCount).fill(0).map(() => 
      createRandomMonster(newLevel, difficulty)
    );
    
    setMonsters(newMonsters);
    setCurrentMonster(newMonsters[0]);
  };
  
  // Capture a monster
  const captureMonster = (id: string) => {
    // Calculate combo
    const now = Date.now();
    const timeSinceLastCapture = now - lastCaptureTime;
    setLastCaptureTime(now);
    
    // If captured within 2 seconds, increase combo
    const newCombo = timeSinceLastCapture < 2000 ? combo + 1 : 1;
    setCombo(newCombo);
    
    setMonsters(prev => 
      prev.map(monster => 
        monster.id === id 
          ? { ...monster, isCaptured: true } 
          : monster
      )
    );
    
    // Find the captured monster
    const capturedMonster = monsters.find(m => m.id === id);
    
    if (capturedMonster) {
      // Add to captured list with a delay for animation
      setTimeout(() => {
        setCapturedMonsters(prev => [...prev, capturedMonster]);
        
        // Calculate bonus points
        const rarityBonus = capturedMonster.rarity === 'rare' ? 5 : 0;
        const comboBonus = Math.min(newCombo * 2, 20);
        const basePoints = 10;
        const totalPoints = basePoints + rarityBonus + comboBonus;
        
        // Increase score
        setScore(prev => prev + totalPoints);
        
        // Check if all monsters are captured
        const remainingMonsters = monsters.filter(m => m.id !== id);
        if (remainingMonsters.length === 0) {
          // Move to next level
          setTimeout(() => nextLevel(), 1000);
        } else {
          // Set next monster as current
          setCurrentMonster(remainingMonsters[0]);
        }
      }, 800);
    }
  };
  
  // Check if monster is captured (for flashlight mode)
  const checkMonsterCaptured = (x: number, y: number, radius: number): boolean => {
    if (!currentMonster) return false;
    
    // Convert monster grid coordinates to pixel coordinates
    // Note: This is a simplified calculation; in the real app we'd need proper grid-to-pixel conversion
    const monsterX = x;
    const monsterY = y;
    
    // Calculate distance between click and monster
    const distance = Math.sqrt(
      Math.pow(monsterX - currentMonster.x, 2) + 
      Math.pow(monsterY - currentMonster.y, 2)
    );
    
    // If distance is less than radius, monster is captured
    return distance <= radius;
  };
  
  const value = {
    gameMode,
    difficulty,
    monsters,
    capturedMonsters,
    currentMonster,
    score,
    level,
    theme,
    combo,
    highScore,
    setGameMode,
    setDifficulty,
    captureMonster,
    checkMonsterCaptured,
    resetGame,
    nextLevel,
    setTheme
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};