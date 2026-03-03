import React from 'react';
import { motion } from 'framer-motion';
import { Slide as SlideType } from './types';

interface SlideProps {
  slide: SlideType;
  isActive: boolean;
}

export const Slide: React.FC<SlideProps> = ({ slide, isActive }) => {
  const variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  const getBackgroundClass = () => {
    if (slide.background) return slide.background;
    const backgrounds = [
      'bg-gradient-to-br from-purple-600/90 to-indigo-800/90',
      'bg-gradient-to-br from-teal-600/90 to-blue-800/90',
      'bg-gradient-to-br from-pink-600/90 to-rose-800/90',
      'bg-gradient-to-br from-amber-600/90 to-orange-800/90',
      'bg-gradient-to-br from-emerald-600/90 to-cyan-800/90'
    ];
    return backgrounds[parseInt(slide.id) % backgrounds.length];
  };

  const getLayoutClass = () => {
    switch (slide.layout) {
      case 'split':
        return 'grid grid-cols-2 gap-12';
      case 'full':
        return 'w-full h-full';
      default:
        return 'flex flex-col items-center justify-center text-center';
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 ${getBackgroundClass()} backdrop-blur-sm`}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
      exit="exit"
      variants={variants}
    >
      <div className={`slide-appear h-full ${getLayoutClass()} p-12`}>
        <div className="max-w-6xl mx-auto">
          {slide.content}
        </div>
      </div>
    </motion.div>
  );
};