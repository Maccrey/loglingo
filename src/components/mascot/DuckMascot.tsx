
import React from 'react';
import { motion } from 'framer-motion';

export type DuckMode = 'thinking' | 'party' | 'lonely' | 'teacher';

interface DuckMascotProps {
  mode: DuckMode;
  className?: string;
  width?: number;
  height?: number;
}

export const DuckMascot: React.FC<DuckMascotProps> = ({ 
  mode, 
  className = '', 
  width = 120, 
  height = 120 
}) => {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Container for SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {mode === 'thinking' && <ThinkingDuck />}
        {mode === 'party' && <PartyDuck />}
        {mode === 'lonely' && <LonelyDuck />}
        {mode === 'teacher' && <TeacherDuck />}
      </svg>
    </div>
  );
};

// Colors
const COLORS = {
  body: '#FFD700', // Gold/Yellow
  beak: '#FF8C00', // Dark Orange
  eye: '#000000',
  cheek: '#FF6347',
  water: '#87CEEB',
  notes: '#333333',
};

// 1. Thinking Duck (Loading) - Bouncing, Blinking, Question Marks
const ThinkingDuck = () => {
  return (
    <motion.g
      initial={{ y: 0 }}
      animate={{ y: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      {/* Body */}
      <path d="M60 100 C60 70 80 50 110 50 C140 50 160 70 160 100 C160 130 140 150 110 150 C80 150 60 130 60 100 Z" fill={COLORS.body} />
      {/* Wing (scratching head) */}
      <motion.path 
        d="M150 100 Q170 80 160 60" 
        stroke={COLORS.body} 
        strokeWidth="12" 
        strokeLinecap="round"
        animate={{ rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      {/* Beak */}
      <path d="M150 90 Q170 95 150 100" fill={COLORS.beak} />
      {/* Eyes (Looking Up/Thinking) */}
      <circle cx="120" cy="80" r="4" fill={COLORS.eye} />
      <circle cx="140" cy="80" r="4" fill={COLORS.eye} />
      
      {/* Question Marks / Thoughts */}
      <motion.g
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 1, 0], y: -20 }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <text x="160" y="50" fontSize="24" fill={COLORS.notes}>?</text>
      </motion.g>
    </motion.g>
  );
};

// 2. Party Duck (Success) - Jumping, Confetti
const PartyDuck = () => {
  return (
    <motion.g>
      <motion.g
        animate={{ y: [-10, -30, -10], rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
         {/* Body */}
         <path d="M60 110 C60 80 80 60 110 60 C140 60 160 80 160 110 C160 140 140 160 110 160 C80 160 60 140 60 110 Z" fill={COLORS.body} />
         {/* Beak (Open/Happy) */}
         <path d="M150 100 L170 105 L150 110 Z" fill={COLORS.beak} />
         {/* Eye (Happy Arc) */}
         <path d="M115 90 Q120 85 125 90" stroke={COLORS.eye} strokeWidth="3" fill="none" />
          {/* Wing (Waving) */}
         <motion.path 
            d="M80 120 Q60 100 50 80" 
            stroke={COLORS.body} 
            strokeWidth="12" 
            strokeLinecap="round"
            animate={{ rotate: [-20, 20, -20] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
         />
      </motion.g>
      
      {/* Simple Confetti Particles (SVG Circles) */}
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={110}
          cy={110}
          r={4}
          fill={['#FF0000', '#00FF00', '#0000FF'][i % 3]}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 2, x: (Math.random() - 0.5) * 100, y: -100 }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
        />
      ))}
    </motion.g>
  );
};

// 3. Lonely Duck (Empty) - Looking down, subtle kick
const LonelyDuck = () => {
  return (
    <motion.g
      initial={{ opacity: 0.8 }} // Slightly faded for sad effect
      animate={{ y: [0, 2, 0] }}
      transition={{ repeat: Infinity, duration: 3 }}
    >
       {/* Body (Slouched) */}
       <path d="M70 120 C70 90 90 80 110 80 C130 80 150 90 150 120 C150 150 130 160 110 160 C90 160 70 150 70 120 Z" fill={COLORS.body} />
       {/* Beak (Down) */}
       <path d="M140 115 L155 120 L140 125 Z" fill={COLORS.beak} />
       {/* Eye (Closed/Sad Line) */}
       <line x1="120" y1="100" x2="130" y2="100" stroke={COLORS.eye} strokeWidth="2" />
       
       {/* Stone kicking animation */}
       <motion.circle 
         cx="160" cy="170" r="3" fill="#888" 
         animate={{ x: [0, 10, 0] }}
         transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
       />
    </motion.g>
  );
};

// 4. Teacher Duck (Guide) - Glasses, Pointing stick
const TeacherDuck = () => {
  return (
    <motion.g>
       {/* Body */}
       <path d="M60 110 C60 80 80 60 110 60 C140 60 160 80 160 110 C160 140 140 160 110 160 C80 160 60 140 60 110 Z" fill={COLORS.body} />
       {/* Beak */}
       <path d="M150 100 Q170 105 150 110" fill={COLORS.beak} />
       
       {/* Glasses */}
       <g stroke="black" strokeWidth="2" fill="none">
         <circle cx="115" cy="90" r="10" />
         <circle cx="140" cy="90" r="10" />
         <line x1="125" y1="90" x2="130" y2="90" />
       </g>
       
       {/* Pointing Stick */}
       <motion.line
          x1="80" y1="130" x2="180" y2="50"
          stroke="#442200" strokeWidth="4" strokeLinecap="round"
          animate={{ rotate: [0, -5, 0], x2: [180, 185, 180], y2: [50, 45, 50] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
       />
    </motion.g>
  );
}
