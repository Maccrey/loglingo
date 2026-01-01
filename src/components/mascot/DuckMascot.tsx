
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export type DuckMode = 'thinking' | 'party' | 'lonely' | 'teacher';

export interface DuckMascotProps {
  mode: DuckMode;
  className?: string;
  width?: number;
  height?: number;
  speech?: string;
  bubbleSide?: 'left' | 'right';
  enableEgg?: boolean;
  onCrack?: () => void;
}

export const DuckMascot: React.FC<DuckMascotProps> = ({ 
  mode, 
  className = '', 
  width = 120, 
  height = 120,
  speech,
  bubbleSide = 'left',
  enableEgg = false,
  onCrack
}) => {
  const [lifecycle, setLifecycle] = useState<'egg' | 'cracking' | 'duck'>(enableEgg ? 'egg' : 'duck');
  const [showBubble, setShowBubble] = useState(!enableEgg && !!speech);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  // Clear all pending timers
  const clearTimers = useCallback(() => {
    timeouts.current.forEach(t => clearTimeout(t));
    timeouts.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Handle interaction (Click on Egg)
  const handleInteraction = useCallback(() => {
    // Check local state 'lifecycle' directly. 
    if (lifecycle !== 'egg') return;

    if (onCrack) onCrack(); // Trigger external callback
    clearTimers();
    setLifecycle('cracking');

    // 1. Cracking Animation (0.4s) -> Duck appears immediately
    // Reduced from 200ms to align with animation duration more tightly
    const t1 = setTimeout(() => {
      setLifecycle('duck');

      // Auto-reset logic (optional, keep if desired for loop)
      const tReset = setTimeout(() => {
          setLifecycle('egg');
      }, 8000); // Extended reset time
      timeouts.current.push(tReset);
      
    }, 400); // Wait for cracking animation to finish
    timeouts.current.push(t1);

  }, [lifecycle, onCrack, clearTimers]); 
  // removed speech from dependencies to prevent reset on speech change

  // Separate effect for Bubble Logic
  useEffect(() => {
     if (lifecycle === 'duck' && speech) {
         // Show bubble with a small delay after duck appears or speech changes
         const t = setTimeout(() => setShowBubble(true), 500);
         const tHide = setTimeout(() => setShowBubble(false), 5500);
         
         timeouts.current.push(t);
         timeouts.current.push(tHide);
         
         return () => {
             clearTimeout(t);
             clearTimeout(tHide);
         };
     } else {
         setShowBubble(false);
     }
  }, [speech, lifecycle]);

  // If egg mode is disabled, always set to duck
  useEffect(() => {
    if (!enableEgg) {
      setLifecycle('duck');
    }
  }, [enableEgg]);

  // Auto-hatch on mount
  useEffect(() => {
    if (enableEgg) {
      // Delay slightly to show egg before cracking
      const t = setTimeout(() => {
        setLifecycle('cracking');
        if (onCrack) onCrack(); 

        const t1 = setTimeout(() => {
          setLifecycle('duck');
          
          // Auto-reset logic (optional, keep if desired for loop)
          const tReset = setTimeout(() => {
             setLifecycle('egg');
          }, 8000); // Extended reset time
          timeouts.current.push(tReset);

        }, 400); // Match handleInteraction timing
        timeouts.current.push(t1);

      }, 500); 
      timeouts.current.push(t);
    }
    // Cleanup on unmount or if enableEgg changes
    return () => clearTimers();
  }, [enableEgg, clearTimers]); // Removing onCrack/speech from here is crucial

  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className} touch-none`} 
      style={{ width, height }}
      drag
      dragMomentum={false} // Stop movement immediately after release
      whileHover={{ scale: 1.1, cursor: "grab" }}
      whileDrag={{ scale: 1.2, cursor: "grabbing" }}
      onClick={enableEgg ? handleInteraction : undefined}
    >
      
      <AnimatePresence>
        {lifecycle === 'egg' || lifecycle === 'cracking' ? (
          <motion.div
            key="egg"
            className="absolute inset-0 m-auto w-[35%] h-[35%] pointer-events-auto cursor-pointer"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={lifecycle === 'cracking' 
              ? { rotate: [-5, 5, -5, 5, 0], scale: 1.1 } 
              : { scale: 1, opacity: 1 }
            }
            exit={{ scale: 1.2, opacity: 0, transition: { duration: 0.2 } }}
            transition={lifecycle === 'cracking' ? { duration: 0.2, repeat: 2 } : {}}
          >
            {/* Egg SVG */}
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
              <ellipse cx="50" cy="60" rx="40" ry="50" fill="#FFF8E7" stroke="#e4e4e7" strokeWidth="2" />
              {/* Speckles */}
              <circle cx="40" cy="50" r="2" fill="#e4e4e7" />
              <circle cx="70" cy="80" r="1.5" fill="#e4e4e7" />
              <circle cx="60" cy="30" r="1" fill="#e4e4e7" />
            </svg>
            {/* Click Hint */}
            <motion.div 
              className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/75 text-white text-[10px] px-2 py-1 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -5, 0] }}
              transition={{ delay: 1, duration: 2, repeat: Infinity }}
            >
              Click me!
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="duck"
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* 0. Speech Bubble (Optional) - Controlled by Timer */}
            <AnimatePresence>
              {showBubble && speech && (
                <motion.div 
                  className={`absolute top-1/2 -translate-y-1/2 w-32 md:w-48 z-40 ${
                    bubbleSide === 'left' ? 'right-full mr-4' : 'left-full ml-4'
                  }`}
                  initial={{ opacity: 0, x: bubbleSide === 'left' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white dark:bg-zinc-800 p-2 md:p-3 rounded-2xl shadow-xl border border-border/50 relative">
                    <div className="text-xs md:text-base font-medium text-center text-black dark:text-white break-words leading-snug">
                      {speech}
                    </div>
                    {/* Bubble Tail */}
                    <div className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white dark:bg-zinc-800 border-border/50 transform rotate-45 ${
                      bubbleSide === 'left' 
                        ? '-right-1 md:-right-[6px] border-t border-r' // Points Right
                        : '-left-1 md:-left-[6px] border-b border-l'  // Points Left
                    }`}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 1. Base Duck Image with Animation */}
            <motion.div
              className="relative z-10 w-full h-full"
              animate={getAnimation(mode)}
              transition={getTransition(mode)}
              style={{
                filter: mode === 'lonely' ? 'grayscale(0.8) brightness(0.9) sepia(0.2)' : 'none',
              }}
            >
              <Image
                src="/images/duck_base.png"
                alt="Loglingo Duck Mascot"
                fill
                className="object-contain drop-shadow-lg select-none pointer-events-none"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Additional Overlays attached to the duck */}
              {mode === 'teacher' && (
                 <motion.div 
                   className="absolute top-[34%] left-[21%] w-[46%] h-[17%]"
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                 >
                   {/* Glasses Overlay */}
                   <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-md select-none pointer-events-none">
                      <g fill="none" stroke="black" strokeWidth="3">
                        <circle cx="25" cy="20" r="14" />
                        <circle cx="75" cy="20" r="14" />
                        <line x1="39" y1="20" x2="61" y2="20" />
                      </g>
                   </svg>
                 </motion.div>
              )}
            </motion.div>

            {/* 2. Environmental Effects (Behind/Around) */}
            
            {/* Thinking: Question Marks */}
            {mode === 'thinking' && (
              <>
                <motion.div
                  className="absolute top-0 right-0 z-20 pointer-events-none"
                  animate={{ y: [-5, -15, -5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-4xl font-bold text-orange-500 select-none">?</span>
                </motion.div>
                <motion.div
                  className="absolute top-4 -right-4 z-20 pointer-events-none"
                  animate={{ y: [-5, -15, -5], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                   <span className="text-3xl font-bold text-orange-400 select-none">?</span>
                </motion.div>
              </>
            )}

            {/* Party: Confetti */}
            {mode === 'party' && (
               <div className="absolute inset-0 pointer-events-none z-0">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                         backgroundColor: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'][i % 5],
                         top: '50%',
                         left: '50%',
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 150,
                        y: (Math.random() - 1) * 150,
                        opacity: [1, 0], 
                        scale: [0, 1.5]
                      }}
                      transition={{
                        duration: 1 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 0.5
                      }}
                    />
                  ))}
               </div>
            )}

            {/* Lonely: Rain/Gloom */}
            {mode === 'lonely' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20 pointer-events-none">
                 <motion.div
                   animate={{ y: [0, 10], opacity: [0, 1, 0] }}
                   transition={{ duration: 1, repeat: Infinity }}
                   className="text-blue-400 text-2xl select-none"
                 >
                   💧
                 </motion.div>
              </div>
            )}

            {/* Teacher: Pointing Stick */}
            {mode === 'teacher' && (
               <motion.div
                 className="absolute bottom-0 -right-4 z-20 w-8 h-24 origin-bottom-left pointer-events-none"
                 animate={{ rotate: [0, -15, 0] }}
                 transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
               >
                  <div className="w-1.5 h-full bg-amber-800 rounded-full dark:bg-amber-600 shadow-xl" />
               </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper for animations
function getAnimation(mode: DuckMode) {
  switch (mode) {
    case 'thinking':
      return { y: [0, -8, 0], rotate: [0, 2, 0, -2, 0] };
    case 'party':
      return { y: [0, -15, 0], scale: [1, 1.1, 1], rotate: [0, -5, 0, 5, 0] };
    case 'lonely':
      return { y: [0, 5, 0], rotate: [0, 3, 0] }; // Drooping
    case 'teacher':
      return { scale: [1, 1.05, 1] }; // Subtle breathing
    default:
      return {};
  }
}

function getTransition(mode: DuckMode): any { // Use any to bypass strict easing type check for simple strings
  switch (mode) {
    case 'thinking':
      return { duration: 2, repeat: Infinity, ease: "easeInOut" };
    case 'party':
      return { duration: 0.6, repeat: Infinity, type: "spring" };
    case 'lonely':
      return { duration: 3, repeat: Infinity, ease: "easeInOut" };
    case 'teacher':
      return { duration: 2, repeat: Infinity, ease: "easeInOut" };
    default:
      return {};
  }
}

