import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Track } from '../types';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  nextTrack: () => void;
  prevTrack: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  setIsPlaying,
  progress,
  setProgress,
  nextTrack,
  prevTrack
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  return (
    <div className="bg-black border-4 border-glitch-cyan p-6 shadow-[8px_8px_0px_var(--color-glitch-cyan)] relative overflow-hidden flex flex-col gap-4">
      <div className="absolute top-0 right-0 p-1 text-[8px] font-mono text-glitch-magenta uppercase tracking-tighter animate-pulse">
        SONIC_DECRYPT: ACTIVE // {currentTrack.artist.substring(0, 4)}
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex items-center gap-6">
        <div className="relative group flex-shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-glitch-cyan to-glitch-magenta opacity-20 group-hover:opacity-40 transition-opacity blur" />
          <motion.div 
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className="w-20 h-20 border-2 border-glitch-cyan p-1 bg-black overflow-hidden relative"
          >
             <img 
               src={currentTrack.cover} 
               alt={currentTrack.title} 
               className={`w-full h-full object-cover grayscale contrast-200 ${isPlaying ? 'animate-pulse' : ''}`} 
               referrerPolicy="no-referrer" 
             />
             <div className="absolute inset-0 bg-glitch-cyan/10 pointer-events-none tearing" />
          </motion.div>
        </div>

        <div className="flex-grow flex flex-col gap-3">
          <div className="overflow-hidden">
            <h3 className="text-xl font-black uppercase tracking-tight glitch-text text-white leading-none mb-1 truncate" data-text={currentTrack.title}>
              {currentTrack.title}
            </h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-glitch-magenta uppercase tracking-widest bg-glitch-magenta/10 px-1 border border-glitch-magenta/30">
                {currentTrack.artist}
              </span>
              <span className="text-[9px] font-mono text-glitch-dim">
                {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'} / {audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative h-4 bg-glitch-dim/50 border border-glitch-cyan overflow-hidden group">
              <input
                type="range"
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                min="0"
                max="100"
                value={progress}
                step="0.1"
                onChange={(e) => {
                   const clickedPercent = (Number(e.target.value) / 100);
                   if (audioRef.current) {
                     audioRef.current.currentTime = clickedPercent * audioRef.current.duration;
                     setProgress(Number(e.target.value));
                   }
                }}
              />
              <motion.div 
                className="absolute top-0 left-0 h-full bg-glitch-cyan z-10"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 h-full w-2 bg-white animate-pulse" />
              </motion.div>
              {/* Fake visualizer bars */}
              <div className="absolute inset-0 flex items-center justify-around px-2 opacity-50 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={isPlaying ? { height: [2, Math.random() * 10 + 2, 2] } : { height: 2 }}
                    transition={{ repeat: Infinity, duration: 0.2 + Math.random() * 0.5 }}
                    className="w-[2px] bg-glitch-magenta"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={prevTrack} className="text-glitch-magenta hover:text-white transition-colors">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-glitch-cyan text-black border-2 border-white hover:bg-white transition-all flex items-center justify-center p-0 shadow-[4px_4px_0px_var(--color-glitch-magenta)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_var(--color-glitch-magenta)]"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-glitch-magenta hover:text-white transition-colors">
              <SkipForward size={20} fill="currentColor" />
            </button>
            
            <div className="ml-auto flex items-center gap-2 opacity-30 group/volume">
              <Volume2 size={12} className="text-glitch-cyan group-hover/volume:opacity-100 transition-opacity" />
              <div className="w-12 h-1 bg-glitch-dim relative overflow-hidden">
                <div className="absolute inset-0 bg-glitch-cyan w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  if (isNaN(time) || !isFinite(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default MusicPlayer;
