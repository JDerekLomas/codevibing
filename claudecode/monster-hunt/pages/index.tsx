import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

// Monster emojis that will animate on the title screen
const MONSTER_EMOJIS = ['👾', '👹', '👻', '👽', '🤖', '👿', '👺', '🦖', '🐲', '🐉', '🧟', '🐙', '🦑', '🦕', '🦂', '🕷️', '🐊', '🐍'];

export default function Home() {
  const router = useRouter();
  const [monsters, setMonsters] = useState<{ emoji: string; x: number; y: number; speed: number; size: number; rotation: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // Initialize monster positions
  useEffect(() => {
    // Add loading effect
    setIsLoading(true);
    
    // Simulate loading for a smoother experience
    setTimeout(() => {
      setIsLoading(false);
      
      // Add title animation
      if (titleRef.current) {
        titleRef.current.classList.add('animate-bounce');
      }
      
      // Initialize monsters with random properties
      const initialMonsters = MONSTER_EMOJIS.map((emoji) => ({
        emoji,
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.3 + Math.random() * 1.2,
        size: 1 + Math.random() * 1.5,
        rotation: Math.random() * 360
      }));
      setMonsters(initialMonsters);
    }, 800);
    
    // Animate monsters
    const interval = setInterval(() => {
      setMonsters((prevMonsters) =>
        prevMonsters.map((monster) => ({
          ...monster,
          x: (monster.x + monster.speed) % 100,
          y: (monster.y + Math.sin(Date.now() / 1000 + monster.x) * 0.5) % 100,
          rotation: (monster.rotation + monster.speed * 2) % 360
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle start button click with transition
  const handleStartClick = () => {
    // Add exit animation
    if (titleRef.current) {
      titleRef.current.classList.remove('animate-bounce');
      titleRef.current.classList.add('scale-150', 'opacity-0');
    }
    
    // Add exit animations to monsters
    setMonsters(prevMonsters => 
      prevMonsters.map(monster => ({
        ...monster,
        speed: monster.speed * 3 // Speed up monsters during exit
      }))
    );
    
    // Navigate after animation completes
    setTimeout(() => {
      router.push('/instructions');
    }, 500);
  };

  return (
    <>
      <Head>
        <title>Monster Hunt</title>
        <meta name="description" content="A math learning game about coordinates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-gray-900">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="absolute inset-0">
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Loading screen */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-3xl animate-ping">🎮</div>
          </div>
        )}

        {/* Dancing monsters */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {monsters.map((monster, index) => (
            <div
              key={index}
              className="absolute transition-all duration-300"
              style={{
                left: `${monster.x}%`,
                top: `${monster.y}%`,
                fontSize: `${monster.size * 2}rem`,
                transform: `translate(-50%, -50%) rotate(${monster.rotation}deg)`,
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
              }}
            >
              {monster.emoji}
            </div>
          ))}
        </div>

        {/* Title and start button */}
        <div className="z-10 text-center transition-all duration-500">
          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold mb-8 transition-all duration-700 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          >
            MONSTER HUNT
          </h1>
          <p className="text-gray-300 mb-8 max-w-md">
            Can you master the coordinate plane and catch all the monster emojis?
          </p>
          <button
            className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-full text-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            onClick={handleStartClick}
          >
            <span className="relative z-10">PLAY</span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse opacity-75"></span>
          </button>
          
          {/* Version info */}
          <div className="mt-8 text-gray-500 text-sm">
            Version 1.0 • Coordinate Learning Game
          </div>
        </div>
      </main>
    </>
  );
}