import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SectionScoreProps {
  label: string;
  score: number;
  icon: React.ReactNode;
  animate?: boolean;
}

const SectionScore: React.FC<SectionScoreProps> = ({ label, score, icon, animate = true }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animate) {
      setAnimatedWidth(0);
      const timer = setTimeout(() => {
        setAnimatedWidth(score);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedWidth(score);
    }
  }, [score, animate]);

  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <motion.div 
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">{label}</span>
          <motion.span 
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="font-semibold text-gray-900"
          >
            {score}%
          </motion.span>
        </div>
        <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            ref={barRef}
            className={`h-full ${getColor(score)} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${animatedWidth}%` }}
            transition={{ 
              duration: 1, 
              ease: "easeOut",
              type: "spring",
              stiffness: 50
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SectionScore;