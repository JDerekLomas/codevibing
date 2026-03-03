import React from 'react';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToSlide: (index: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
}) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-card rounded-full px-8 py-4 flex items-center gap-6">
        <motion.button
          onClick={onPrevious}
          disabled={currentSlide === 0}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>

        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onGoToSlide(index)}
              className={`transition-all ${
                currentSlide === index ? 'scale-1.5' : 'scale-1 opacity-60 hover:opacity-100'
              }`}
              whileHover={{ scale: currentSlide === index ? 1.5 : 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <Circle
                className={`w-3 h-3 ${
                  currentSlide === index ? 'fill-white' : 'fill-transparent'
                } text-white`}
              />
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
};