import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED } from '../constants';

interface SnakeGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  highScore: number;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ 
  score, 
  setScore, 
  highScore, 
  setHighScore,
  isPaused,
  setIsPaused
}) => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood, score, highScore, setHighScore, setScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED - Math.min(score / 2, 100));
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative border-4 border-glitch-magenta bg-black shadow-[8px_8px_0px_var(--color-glitch-magenta)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 18, 
          height: GRID_SIZE * 18,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-glitch-cyan" />
          ))}
        </div>

        {/* Snake Body */}
        {snake.map((segment, index) => (
          <motion.div
            key={`${index}-${segment.x}-${segment.y}`}
            className={`absolute w-[18px] h-[18px] border border-black ${
              index === 0 
                ? 'bg-glitch-cyan z-20 shadow-[2px_2px_0px_var(--color-glitch-magenta)]' 
                : 'bg-glitch-cyan/60 z-10'
            }`}
            style={{
              left: segment.x * 18,
              top: segment.y * 18,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            opacity: [1, 0, 1],
            scale: [1, 1.2, 1],
            x: [0, 2, -2, 0]
          }}
          transition={{ repeat: Infinity, duration: 0.1, ease: "steps(2)" }}
          className="absolute w-[18px] h-[18px] bg-glitch-magenta z-10 shadow-[2px_2px_0px_var(--color-glitch-cyan)]"
          style={{
            left: food.x * 18,
            top: food.y * 18,
          }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-glitch-magenta/90 z-30 flex flex-col items-center justify-center gap-4 text-center p-6 tearing"
            >
              <h2 className="text-4xl font-black text-black uppercase glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
              <button 
                onClick={resetGame}
                className="mt-2 px-6 py-2 bg-black hover:bg-white text-glitch-cyan font-bold transition-all border-2 border-glitch-cyan"
              >
                REINITIALIZE
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {!isGameOver && isPaused && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center p-6 tearing"
            >
              <div className="flex flex-col items-center gap-2">
                <Pause size={48} className="text-glitch-cyan animate-pulse" />
                <span className="text-xs uppercase font-mono tracking-tighter">PROCESS_HALTED</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="p-3 bg-black border-2 border-glitch-cyan text-glitch-cyan hover:bg-glitch-cyan hover:text-black transition-all outline-none"
          disabled={isGameOver}
        >
          {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
        </button>
        <button 
          onClick={resetGame}
          className="px-6 py-3 bg-black border-2 border-glitch-magenta text-glitch-magenta hover:bg-glitch-magenta hover:text-black transition-all font-mono text-xs uppercase tracking-widest"
        >
          [PURGE_GRID]
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
