import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Point, Direction } from '@/src/types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

const getRandomPoint = (exclude: Point[] = []): Point => {
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (exclude.some(p => p.x === point.x && p.y === point.y));
  return point;
};

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 13 }]);
  const [food, setFood] = useState<Point>(getRandomPoint());
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isCrtOn, setIsCrtOn] = useState(true);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setFood(getRandomPoint());
    setDirection(Direction.UP);
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(getRandomPoint(newSnake));
        setSpeed(s => Math.max(80, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, isPlaying, isGameOver, food, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== Direction.DOWN) setDirection(Direction.UP); break;
        case 'ArrowDown': if (direction !== Direction.UP) setDirection(Direction.DOWN); break;
        case 'ArrowLeft': if (direction !== Direction.RIGHT) setDirection(Direction.LEFT); break;
        case 'ArrowRight': if (direction !== Direction.LEFT) setDirection(Direction.RIGHT); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [isPlaying, isGameOver, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score Header */}
      <div className="flex gap-8 items-center bg-slate-900/50 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/5 shadow-inner">
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Current Score</span>
            <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{score}</span>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-bold">Top Session</span>
            <span className="text-2xl font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">{highScore}</span>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <button 
            onClick={() => setIsCrtOn(!isCrtOn)}
            className={cn(
                "px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest transition-all",
                isCrtOn ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-500 border border-transparent"
            )}
        >
            CRT: {isCrtOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Game Board Container - The "Arcade Machine" */}
      <div className="relative group">
        {/* Machine Shell */}
        <div className="absolute -inset-4 bg-slate-900 rounded-[2rem] border-8 border-slate-800 shadow-2xl" />
        <div className="absolute inset-x-0 -bottom-12 h-16 bg-gradient-to-b from-slate-800 to-slate-950 rounded-b-2xl border-x-8 border-b-8 border-slate-800" />
        
        {/* Glowing Accents */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-slate-800 border-x border-b border-cyan-500/50 rounded-b-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] z-40">
            <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-[0.4em]">Vector_Engine_v2.0</span>
        </div>

        <div className={cn(
            "relative p-0 rounded-lg bg-black shadow-[inset_0_0_100px_rgba(0,0,0,1)] overflow-hidden border-2 border-slate-800",
            isCrtOn && "after:content-[''] after:absolute after:inset-0 after:pointer-events-none after:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] after:bg-[length:100%_2px,3px_100%] after:z-50"
        )}>
            {/* CRT Flicker & Reflection */}
            {isCrtOn && (
                <>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent z-40" />
                    <motion.div 
                        animate={{ opacity: [0.05, 0.1, 0.05] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        className="absolute inset-0 bg-white/5 pointer-events-none z-40" 
                    />
                </>
            )}

            {/* Grid Background Effect */}
            <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10 pointer-events-none z-0">
                {Array.from({ length: 400 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-cyan-500/20" />
                ))}
            </div>

            <div 
              className={cn(
                "relative grid grid-cols-20 grid-rows-20 gap-0",
                isCrtOn && "animate-[pulse_4s_ease-in-out_infinite]"
              )}
              style={{ 
                width: '400px', 
                height: '400px',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
              }}
            >
              {/* Snake Rendering */}
              {snake.map((p, i) => (
                <div
                  key={`${i}-${p.x}-${p.y}`}
                  className={cn(
                    "w-full h-full transition-all duration-150",
                    i === 0 ? "bg-cyan-400 z-10 rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.9)]" : "bg-cyan-600/40 border-[1px] border-cyan-400/20"
                  )}
                  style={{
                    gridColumnStart: p.x + 1,
                    gridRowStart: p.y + 1,
                  }}
                />
              ))}

              {/* Food Rendering */}
              <motion.div
                key={`food-${food.x}-${food.y}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0.8, 1.2, 1], opacity: 1, rotate: [0, 90, 180, 270] }}
                transition={{ 
                  duration: 0.4,
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 4, ease: "linear" }
                }}
                className="w-full h-full flex items-center justify-center z-10"
                style={{
                  gridColumnStart: food.x + 1,
                  gridRowStart: food.y + 1,
                }}
              >
                <div className="w-2.5 h-2.5 bg-rose-500 rotate-45 shadow-[0_0_15px_rgba(244,63,94,1)] border border-rose-300/30" />
              </motion.div>

              {/* Overlays */}
              <AnimatePresence>
                {!isPlaying && !isGameOver && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-[60]"
                  >
                    <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mb-8 flex flex-col items-center"
                    >
                        <h2 className="text-4xl font-black text-cyan-400 italic tracking-tighter mb-1 select-none">SNK_PROTOCOL</h2>
                        <div className="h-0.5 w-32 bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    </motion.div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34,211,238,0.6)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetGame}
                      className="px-10 py-4 bg-cyan-500 text-slate-950 rounded-none font-black text-xl flex items-center gap-3 transition-shadow"
                    >
                      INSERT COIN
                    </motion.button>
                    <p className="mt-6 text-slate-500 text-[9px] font-mono tracking-[0.5em] animate-pulse">BOOT SEQUENCE READY</p>
                  </motion.div>
                )}

                {isGameOver && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-rose-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-[70]"
                  >
                    <motion.h2 
                        animate={{ scale: [1, 1.1, 1] }}
                        className="text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                        HALTED
                    </motion.h2>
                    <div className="flex flex-col items-center gap-4 mb-10 text-rose-200">
                        <div className="flex items-center gap-2 uppercase tracking-widest text-xs font-black bg-rose-500 text-rose-950 px-4 py-1">
                             Critical Error
                        </div>
                        <span className="text-2xl font-mono text-white">Score: {score}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={resetGame}
                      className="px-12 py-5 bg-white text-rose-950 rounded-none font-black text-xl flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
                    >
                      <RotateCcw className="w-6 h-6" /> SYSTEM REBOOT
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>
      </div>
      
      {/* Physical Controller Panel */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-slate-900/50 rounded-3xl border border-white/5 mt-4">
        <div />
        <button 
            className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 transition-all hover:bg-slate-700 active:bg-cyan-500/50 group"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))}
        >
            <div className="w-2 h-2 rounded-full bg-slate-600 group-active:bg-white" />
        </button>
        <div />
        <button 
            className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 transition-all hover:bg-slate-700 active:bg-cyan-500/50 group"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))}
        >
            <div className="w-2 h-2 rounded-full bg-slate-600 group-active:bg-white" />
        </button>
        <div className="w-12 h-12 bg-slate-950/50 rounded-full flex items-center justify-center border-2 border-white/5">
            <div className="w-4 h-4 rounded-full bg-rose-500/20 animate-ping" />
        </div>
        <button 
            className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 transition-all hover:bg-slate-700 active:bg-cyan-500/50 group"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))}
        >
            <div className="w-2 h-2 rounded-full bg-slate-600 group-active:bg-white" />
        </button>
        <div />
        <button 
            className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 transition-all hover:bg-slate-700 active:bg-cyan-500/50 group"
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))}
        >
            <div className="w-2 h-2 rounded-full bg-slate-600 group-active:bg-white" />
        </button>
        <div />
      </div>
    </div>
  );
};
