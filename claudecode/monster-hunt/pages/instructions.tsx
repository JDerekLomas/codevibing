import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// Sample monsters for display
const SAMPLE_MONSTERS = ['👾', '👹', '👻', '👽', '🤖'];

export default function Instructions() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  
  // Instructions steps with images and text
  const steps = [
    {
      title: "Welcome to Monster Hunt!",
      content: "Hunt monsters on the coordinate plane. Use your math skills to capture them all!",
      icon: "🎯"
    },
    {
      title: "Flashlight Mode",
      content: "In this mode, monsters are hidden in the dark. Click to shine your flashlight at specific coordinates.",
      icon: "🔦"
    },
    {
      title: "Slider Mode",
      content: "Adjust the X and Y sliders to position your targeting lines on the grid. Press CAPTURE when you're aligned with a monster.",
      icon: "⬅️➡️"
    },
    {
      title: "Difficulty Levels",
      content: "The game gets harder with more quadrants and moving monsters. Challenge yourself as you progress!",
      icon: "🏆"
    },
    {
      title: "Collection",
      content: "Capture monsters to add them to your collection. Try to catch them all!",
      icon: "📚"
    }
  ];
  
  // Handle animation between steps
  useEffect(() => {
    setAnimationClass('animate-fadeIn');
    const timer = setTimeout(() => {
      setAnimationClass('');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentStep]);
  
  // Navigate to next instruction or start game
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setAnimationClass('animate-fadeOut');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      // Start game with animation
      setAnimationClass('animate-fadeOut');
      setTimeout(() => {
        router.push('/game');
      }, 300);
    }
  };
  
  // Skip to game
  const handleSkip = () => {
    setAnimationClass('animate-fadeOut');
    setTimeout(() => {
      router.push('/game');
    }, 300);
  };
  
  // Go back to previous instruction or home
  const handleBack = () => {
    if (currentStep > 0) {
      setAnimationClass('animate-fadeOut');
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
      }, 300);
    } else {
      setAnimationClass('animate-fadeOut');
      setTimeout(() => {
        router.push('/');
      }, 300);
    }
  };
  
  // Render instruction dots
  const renderDots = () => {
    return (
      <div className="flex gap-2 mt-4">
        {steps.map((_, index) => (
          <div 
            key={index} 
            className={`w-3 h-3 rounded-full ${
              index === currentStep ? 'bg-purple-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };
  
  // Animation of sample monster for current step
  const renderSampleVisual = () => {
    const currentIcon = steps[currentStep].icon;
    
    switch (currentStep) {
      case 0: // Welcome
        return (
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {SAMPLE_MONSTERS.map((emoji, i) => (
                <div 
                  key={i}
                  className="absolute text-4xl animate-bounce"
                  style={{
                    top: `${50 + Math.sin(i * 2) * 20}%`,
                    left: `${50 + Math.cos(i * 2) * 20}%`,
                    animationDelay: `${i * 0.2}s`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {emoji}
                </div>
              ))}
              <div className="text-6xl">{currentIcon}</div>
            </div>
          </div>
        );
      
      case 1: // Flashlight mode
        return (
          <div className="relative w-full h-32 flex items-center justify-center mb-6 bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute w-full h-full bg-black bg-opacity-90">
              <div 
                className="absolute w-20 h-20 rounded-full" 
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 70%, transparent 100%)',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'moveAround 3s infinite ease-in-out'
                }}
              />
            </div>
            <div className="text-4xl absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">👾</div>
            <style jsx>{`
              @keyframes moveAround {
                0% { left: 30%; top: 50%; }
                50% { left: 70%; top: 50%; }
                100% { left: 30%; top: 50%; }
              }
            `}</style>
          </div>
        );
      
      case 2: // Slider mode
        return (
          <div className="w-full h-32 flex flex-col items-center justify-center mb-6 bg-gray-800 rounded-lg">
            <div className="relative w-full h-16 mb-2">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-600" />
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-600" />
              <div className="absolute text-4xl" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>👾</div>
              <div className="absolute left-0 right-0 bottom-0 h-1 bg-red-500" style={{ animation: 'slideX 3s infinite ease-in-out' }} />
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-green-500" style={{ animation: 'slideY 3s infinite ease-in-out' }} />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="text-red-400">X:</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '60%', animation: 'slideWidth 3s infinite ease-in-out' }} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">Y:</span>
                <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '70%', animation: 'slideWidth 3s infinite ease-in-out reverse' }} />
                </div>
              </div>
            </div>
            <style jsx>{`
              @keyframes slideX {
                0% { transform: translateY(0) scaleY(2); }
                50% { transform: translateY(14px) scaleY(2); }
                100% { transform: translateY(0) scaleY(2); }
              }
              @keyframes slideY {
                0% { transform: translateX(0) scaleX(2); }
                50% { transform: translateX(-14px) scaleX(2); }
                100% { transform: translateX(0) scaleX(2); }
              }
              @keyframes slideWidth {
                0% { width: 30%; }
                50% { width: 70%; }
                100% { width: 30%; }
              }
            `}</style>
          </div>
        );
      
      case 3: // Difficulty levels
        return (
          <div className="flex gap-4 justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white" />
                <div className="absolute text-xl" style={{ right: '25%', top: '25%' }}>👾</div>
              </div>
              <span className="text-xs mt-1">Level 1</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white" />
                <div className="absolute text-xl" style={{ right: '25%', top: '25%' }}>👾</div>
                <div className="absolute text-xl" style={{ left: '25%', top: '25%' }}>👹</div>
              </div>
              <span className="text-xs mt-1">Level 2</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
                <div className="absolute bottom-0 left-1/2 top-0 w-px bg-white" />
                <div className="absolute text-xl" style={{ right: '25%', top: '25%' }}>👾</div>
                <div className="absolute text-xl" style={{ left: '25%', top: '25%' }}>👹</div>
                <div className="absolute text-xl" style={{ right: '25%', bottom: '25%' }}>👻</div>
                <div className="absolute text-xl" style={{ left: '25%', bottom: '25%' }}>👽</div>
              </div>
              <span className="text-xs mt-1">Level 3</span>
            </div>
          </div>
        );
      
      case 4: // Collection
        return (
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {SAMPLE_MONSTERS.map((emoji, i) => (
              <div 
                key={i} 
                className="text-3xl relative"
                style={{ 
                  animation: i % 2 === 0 ? 'bounce 1s infinite' : 'pulse 1s infinite',
                  animationDelay: `${i * 0.2}s`
                }}
              >
                {emoji}
                {i === 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                )}
              </div>
            ))}
            <style jsx>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
            `}</style>
          </div>
        );
        
      default:
        return <div className="text-6xl mb-6">{currentIcon}</div>;
    }
  };

  return (
    <>
      <Head>
        <title>Monster Hunt - Instructions</title>
        <meta name="description" content="Learn how to play Monster Hunt" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main className="flex min-h-screen flex-col items-center justify-center p-6 relative bg-gray-900">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `float ${Math.random() * 10 + 10}s infinite linear`
              }}
            />
          ))}
          <style jsx>{`
            @keyframes float {
              from { transform: translateY(0) rotate(0deg); }
              to { transform: translateY(-100vh) rotate(360deg); }
            }
          `}</style>
        </div>
        
        {/* Instruction card */}
        <div className={`max-w-md w-full bg-gray-800 bg-opacity-95 rounded-2xl p-6 shadow-2xl ${animationClass}`}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              {steps[currentStep].title}
            </h1>
            
            {renderSampleVisual()}
            
            <p className="text-lg mb-6 text-gray-300">
              {steps[currentStep].content}
            </p>
            
            {renderDots()}
            
            <div className="flex justify-between mt-8">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={handleBack}
              >
                {currentStep === 0 ? 'Back' : 'Previous'}
              </button>
              
              <button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                onClick={handleNext}
              >
                {currentStep < steps.length - 1 ? 'Next' : 'Start Game'}
              </button>
            </div>
            
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="mt-4 text-gray-400 hover:text-white text-sm"
              >
                Skip Tutorial
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}