import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CoordinateGrid from '../components/CoordinateGrid';
import Monster from '../components/Monster';
import Flashlight from '../components/Flashlight';
import CoordinateSliders from '../components/CoordinateSliders';
import { GameProvider, useGame, GameMode, DifficultyLevel, ThemeType, getThemeColors } from '../components/GameContext';

// Constants
const GRID_SIZE = 40; // Pixels per grid unit
const FLASHLIGHT_RADIUS = 80; // Radius of the flashlight in pixels

// Main game component wrapped with provider
const GamePage = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

// Game content with access to context
const GameContent = () => {
  const router = useRouter();
  const {
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
    resetGame,
    setTheme
  } = useGame();
  
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [sliderValues, setSliderValues] = useState({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [captureEffect, setCaptureEffect] = useState(false);
  const [comboAnimation, setComboAnimation] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [showTutorialTip, setShowTutorialTip] = useState(true);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const themeColors = getThemeColors(theme);
  
  // Check viewport orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);
  
  // Hide tutorial tip after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTutorialTip(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Combo animation effect
  useEffect(() => {
    if (combo > 1) {
      setComboAnimation(true);
      const timer = setTimeout(() => {
        setComboAnimation(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [combo]);
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (gameAreaRef.current) {
        const { clientWidth, clientHeight } = gameAreaRef.current;
        setGridSize({ 
          width: clientWidth, 
          height: clientHeight 
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate grid origin based on difficulty
  const originX = difficulty >= 2 ? gridSize.width / 2 : 0;
  const originY = difficulty === 1 ? gridSize.height : gridSize.height / 2;
  
  // Handle flashlight tap
  const handleFlashlightTap = (x: number, y: number) => {
    if (!currentMonster) return;
    
    // Convert pixel coordinates to grid coordinates
    const gridX = Math.round((x - originX) / GRID_SIZE);
    const gridY = Math.round((originY - y) / GRID_SIZE);
    
    // Check if the monster is captured
    const monsterX = originX + (currentMonster.x * GRID_SIZE);
    const monsterY = originY - (currentMonster.y * GRID_SIZE);
    
    const distance = Math.sqrt(
      Math.pow(x - monsterX, 2) + 
      Math.pow(y - monsterY, 2)
    );
    
    if (distance <= FLASHLIGHT_RADIUS) {
      triggerCaptureEffect();
      captureMonster(currentMonster.id);
    }
  };
  
  // Handle slider capture attempt
  const handleSliderCapture = () => {
    if (!currentMonster) return;
    
    // Check if coordinates match (with slight tolerance for fractional values)
    const xDiff = Math.abs(sliderValues.x - currentMonster.x);
    const yDiff = Math.abs(sliderValues.y - currentMonster.y);
    
    // Higher levels require more precision
    const tolerance = level < 5 ? 0.5 : level < 10 ? 0.3 : 0.1;
    
    if (xDiff <= tolerance && yDiff <= tolerance) {
      triggerCaptureEffect();
      captureMonster(currentMonster.id);
    } else {
      // Near miss feedback
      triggerNearMissFeedback(xDiff, yDiff);
    }
  };
  
  // Visual feedback for capture effect
  const triggerCaptureEffect = () => {
    setCaptureEffect(true);
    
    // Trigger haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 100]);
    }
    
    setTimeout(() => {
      setCaptureEffect(false);
    }, 1000);
  };
  
  // Visual feedback for near misses
  const triggerNearMissFeedback = (xDiff: number, yDiff: number) => {
    // Play audio feedback 
    // (We'd actually implement audio here in a full version)
    
    // Vibration feedback on mobile (stronger for closer attempts)
    if ('vibrate' in navigator) {
      const intensity = Math.max(10, 50 - Math.floor((xDiff + yDiff) * 25));
      navigator.vibrate(intensity);
    }
  };
  
  // Handle game mode change
  const changeGameMode = (mode: GameMode) => {
    setGameMode(mode);
    setShowSettings(false);
  };
  
  // Handle difficulty change
  const changeDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    setShowSettings(false);
  };
  
  // Handle theme change
  const changeTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setShowSettings(false);
  };
  
  // Return to home screen
  const handleReturnHome = () => {
    router.push('/');
  };
  
  // Toggle collection view
  const toggleCollection = () => {
    setShowCollection(!showCollection);
  };
  
  // Get the coordinate display for current monster
  const getCoordinateDisplay = () => {
    if (!currentMonster) return "(?, ?)";
    
    return gameMode === 'flashlight' 
      ? `(${currentMonster.x}, ${currentMonster.y})`
      : "Find the monster!";
  };
  
  // Get the min/max values for sliders based on difficulty
  const getSliderRanges = () => {
    // Adjust ranges based on level and difficulty
    const baseRange = 10 + Math.floor(level / 3);
    
    switch (difficulty) {
      case 1:
        return { minX: 0, maxX: baseRange, minY: 0, maxY: baseRange };
      case 2:
        return { minX: -baseRange, maxX: baseRange, minY: 0, maxY: baseRange };
      case 4:
        return { minX: -baseRange, maxX: baseRange, minY: -baseRange, maxY: baseRange };
      default:
        return { minX: 0, maxX: baseRange, minY: 0, maxY: baseRange };
    }
  };
  
  const sliderRanges = getSliderRanges();
  
  return (
    <>
      <Head>
        <title>Monster Hunt - Game</title>
        <meta name="description" content="Play Monster Hunt" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main className={`flex flex-col min-h-screen bg-gray-900 ${themeColors.gradientFrom} ${themeColors.gradientTo} bg-gradient-to-b`}>
        {/* Game header */}
        <header className={`${themeColors.primary} p-3 flex justify-between items-center shadow-lg`}>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold hidden sm:block">Monster Hunt</h1>
            <div className="bg-black bg-opacity-30 px-3 py-1 rounded-md">
              Level: {level}
            </div>
            <div className={`${captureEffect ? 'animate-pulse scale-110' : ''} transition-all bg-black bg-opacity-30 px-3 py-1 rounded-md`}>
              Score: {score}
            </div>
          </div>
          
          <div className="flex gap-2">
            {combo > 1 && (
              <div 
                className={`bg-yellow-600 bg-opacity-80 px-3 py-1 rounded-md font-bold ${
                  comboAnimation ? 'animate-bounce scale-110' : ''
                }`}
              >
                Combo x{combo}!
              </div>
            )}
            
            <button
              onClick={toggleCollection}
              className="bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-md"
              aria-label="View Collection"
            >
              <span className="text-lg">📚</span>
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-black bg-opacity-30 hover:bg-opacity-50 p-2 rounded-md"
              aria-label="Settings"
            >
              <span className="text-lg">⚙️</span>
            </button>
          </div>
        </header>
        
        {/* Settings panel */}
        {showSettings && (
          <div className={`${themeColors.secondary} p-4 border-b ${themeColors.borderColor}`}>
            <div className="flex flex-wrap gap-4 justify-center">
              <div>
                <h3 className="text-sm mb-2">Game Mode:</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeGameMode('flashlight')}
                    className={`px-3 py-1 rounded-md ${
                      gameMode === 'flashlight' 
                        ? themeColors.accent
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Flashlight 🔦
                  </button>
                  <button
                    onClick={() => changeGameMode('slider')}
                    className={`px-3 py-1 rounded-md ${
                      gameMode === 'slider' 
                        ? themeColors.accent
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Slider ⬅️➡️
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm mb-2">Difficulty:</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeDifficulty(1)}
                    className={`px-3 py-1 rounded-md ${
                      difficulty === 1 
                        ? themeColors.accent
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    1 Quadrant
                  </button>
                  <button
                    onClick={() => changeDifficulty(2)}
                    className={`px-3 py-1 rounded-md ${
                      difficulty === 2 
                        ? themeColors.accent
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    2 Quadrants
                  </button>
                  <button
                    onClick={() => changeDifficulty(4)}
                    className={`px-3 py-1 rounded-md ${
                      difficulty === 4 
                        ? themeColors.accent
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    4 Quadrants
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm mb-2">Theme:</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeTheme('forest')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'forest' ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ background: 'linear-gradient(to bottom, #1b4d2b, #0f291a)' }}
                    aria-label="Forest Theme"
                  >
                    🌲
                  </button>
                  <button
                    onClick={() => changeTheme('space')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'space' ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ background: 'linear-gradient(to bottom, #291b4d, #1a0f29)' }}
                    aria-label="Space Theme"
                  >
                    🚀
                  </button>
                  <button
                    onClick={() => changeTheme('underwater')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'underwater' ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ background: 'linear-gradient(to bottom, #1b3a4d, #0f1e29)' }}
                    aria-label="Underwater Theme"
                  >
                    🐠
                  </button>
                  <button
                    onClick={() => changeTheme('desert')}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'desert' ? 'ring-2 ring-white' : ''
                    }`}
                    style={{ background: 'linear-gradient(to bottom, #8c6318, #4d370f)' }}
                    aria-label="Desert Theme"
                  >
                    🏜️
                  </button>
                </div>
              </div>
              
              <div className="w-full flex justify-center mt-2 gap-4">
                <button
                  onClick={resetGame}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded-md"
                >
                  Reset Game
                </button>
                
                <button
                  onClick={handleReturnHome}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded-md"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Monster collection panel */}
        {showCollection && (
          <div className={`${themeColors.secondary} p-4 border-b ${themeColors.borderColor}`}>
            <div className="flex flex-col">
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-bold">Monster Collection</h3>
                <button
                  onClick={toggleCollection}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              
              {capturedMonsters.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  No monsters captured yet. Start hunting!
                </div>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3 p-2">
                  {capturedMonsters.map((monster) => (
                    <div 
                      key={monster.id} 
                      className="flex flex-col items-center"
                    >
                      <div 
                        className={`text-3xl ${monster.rarity === 'rare' ? 'text-yellow-300' : ''}`}
                        style={{ filter: monster.rarity === 'rare' ? 'drop-shadow(0 0 3px gold)' : undefined }}
                      >
                        {monster.emoji}
                      </div>
                      <div className="text-xs mt-1 text-gray-300">
                        ({monster.x}, {monster.y})
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {capturedMonsters.length > 0 && (
                <div className="mt-2 text-center text-sm text-gray-400">
                  {capturedMonsters.length} monster{capturedMonsters.length !== 1 ? 's' : ''} captured
                  {capturedMonsters.filter(m => m.rarity === 'rare').length > 0 && 
                    ` (${capturedMonsters.filter(m => m.rarity === 'rare').length} rare)`
                  }
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Game objective */}
        <div className={`${themeColors.primary} p-2 text-center border-b ${themeColors.borderColor} relative overflow-hidden`}>
          {gameMode === 'flashlight' ? (
            <p>Find the monster at: <span className="font-mono font-bold">{getCoordinateDisplay()}</span></p>
          ) : (
            <p>Move the sliders to capture the monster!</p>
          )}
          
          {/* Tutorial tip */}
          {showTutorialTip && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-xl animate-fadeInOut">
              {gameMode === 'flashlight' 
                ? 'Tap to shine your flashlight and find the monster!' 
                : 'Line up the X and Y coordinates, then tap CAPTURE!'}
            </div>
          )}
        </div>
        
        {/* Game area */}
        <div className="flex flex-col flex-grow">
          <div className="flex-grow relative overflow-hidden" ref={gameAreaRef}>
            {gridSize.width > 0 && (
              <>
                {/* Coordinate grid */}
                <CoordinateGrid
                  quadrants={difficulty}
                  width={gridSize.width}
                  height={gridSize.height}
                  gridSize={GRID_SIZE}
                  targetX={gameMode === 'slider' ? sliderValues.x : undefined}
                  targetY={gameMode === 'slider' ? sliderValues.y : undefined}
                  theme={theme}
                  level={level}
                />
                
                {/* Monsters */}
                {monsters.map(monster => (
                  <Monster
                    key={monster.id}
                    monster={{
                      ...monster,
                      isVisible: gameMode === 'slider' || monster.isVisible
                    }}
                    gridSize={GRID_SIZE}
                    originX={originX}
                    originY={originY}
                  />
                ))}
                
                {/* Game mode specific UI */}
                {gameMode === 'flashlight' && (
                  <div className="absolute inset-0 bg-black bg-opacity-90">
                    <Flashlight
                      width={gridSize.width}
                      height={gridSize.height}
                      radius={FLASHLIGHT_RADIUS}
                      onMove={() => {}}
                      onTap={handleFlashlightTap}
                      theme={theme}
                      level={level}
                    />
                  </div>
                )}
                
                {/* Capture effect overlay */}
                {captureEffect && (
                  <div className="absolute inset-0 bg-white bg-opacity-20 animate-flash pointer-events-none" />
                )}
              </>
            )}
          </div>
          
          {/* Controls */}
          <div className={`${themeColors.primary} p-4 border-t ${themeColors.borderColor}`}>
            {gameMode === 'slider' && (
              <div className="flex flex-col items-center gap-4">
                <CoordinateSliders
                  minX={sliderRanges.minX}
                  maxX={sliderRanges.maxX}
                  minY={sliderRanges.minY}
                  maxY={sliderRanges.maxY}
                  x={sliderValues.x}
                  y={sliderValues.y}
                  onXChange={x => setSliderValues(prev => ({ ...prev, x }))}
                  onYChange={y => setSliderValues(prev => ({ ...prev, y }))}
                  theme={theme}
                  level={level}
                />
                
                <button
                  className={`${themeColors.accent} hover:bg-opacity-90 px-6 py-2 rounded-full font-bold transition-transform active:scale-95`}
                  onClick={handleSliderCapture}
                >
                  CAPTURE
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Collection bar */}
        <div className={`${themeColors.primary} py-2 px-3 border-t ${themeColors.borderColor} overflow-hidden`}>
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            <span className="text-sm text-gray-400 whitespace-nowrap">Recent:</span>
            {capturedMonsters.length === 0 ? (
              <span className="text-gray-500">None yet</span>
            ) : (
              capturedMonsters.slice(-10).map((monster, index) => (
                <div 
                  key={monster.id} 
                  className={`text-2xl ${
                    monster.rarity === 'rare' ? 'text-yellow-300' : ''
                  }`}
                  style={{
                    filter: monster.rarity === 'rare' ? 'drop-shadow(0 0 3px gold)' : undefined,
                    animation: index === capturedMonsters.length - 1 ? 'bounceIn 0.5s' : undefined
                  }}
                >
                  {monster.emoji}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      {/* Global styles */}
      <style jsx global>{`
        /* Hide scrollbars */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Animations */
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .animate-flash {
          animation: flash 0.5s;
        }
        
        .animate-fadeInOut {
          animation: fadeInOut 4s infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s forwards;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

export default GamePage;