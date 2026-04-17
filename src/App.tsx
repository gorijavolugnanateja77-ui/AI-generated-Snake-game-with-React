import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Activity, Terminal, Database, Cpu, ShieldAlert } from 'lucide-react';
import { TRACKS } from './constants';

export default function App() {
  // Game State
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Music State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = TRACKS[currentIndex];

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-glitch-bg text-glitch-cyan flex justify-center items-center p-4 relative font-sans selection:bg-glitch-magenta selection:text-white">
      <div className="static-overlay" />
      
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 z-10">
        
        {/* LEFT COMPARTMENT: NEURAL_RECORDS */}
        <aside className="flex flex-col gap-6">
          <div className="panel-border bg-black p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-glitch-magenta pb-2">
              <Database size={18} className="text-glitch-magenta" />
              <h2 className="text-lg font-black uppercase tracking-tighter glitch-text" data-text="NEURAL_RECORDS">NEURAL_RECORDS</h2>
            </div>
            
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {TRACKS.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center gap-3 p-2 border transition-all text-left group ${
                    currentIndex === index 
                    ? 'border-glitch-cyan bg-glitch-cyan/10' 
                    : 'border-glitch-dim hover:border-glitch-magenta hover:bg-glitch-magenta/5'
                  }`}
                >
                  <div className="w-8 h-8 flex-shrink-0 relative">
                     <img src={track.cover} alt="" className="w-full h-full object-cover grayscale brightness-50 contrast-150" referrerPolicy="no-referrer" />
                     <div className="absolute inset-0 bg-glitch-cyan/20 group-hover:bg-glitch-magenta/20 transition-colors" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-black truncate text-white uppercase">{track.title}</div>
                    <div className="text-[9px] text-glitch-magenta font-mono uppercase tracking-tighter">{track.artist}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-border bg-black p-4 flex flex-col gap-2 tearing">
            <div className="flex items-center gap-2 mb-2">
               <Cpu size={14} className="text-glitch-cyan" />
               <span className="text-[9px] font-mono uppercase tracking-[0.2em]">Hardware_Status</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-glitch-dim">CPU_LOAD</span>
                <span className="animate-pulse">89.4%</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-glitch-dim">TEMP_CORE</span>
                <span className="text-glitch-magenta">CRITICAL</span>
              </div>
              <div className="w-full h-1 bg-glitch-dim mt-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  className="h-full bg-glitch-magenta"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER COMPARTMENT: SYNTH_GRID */}
        <main className="flex flex-col gap-8">
          <header className="flex justify-between items-end border-b-2 border-glitch-cyan pb-4">
             <div>
               <h1 className="text-5xl font-black uppercase italic tracking-tighter glitch-text leading-none" data-text="SUB_SYNTH_GRID">SUB_SYNTH_GRID</h1>
               <p className="text-[10px] font-mono uppercase tracking-[0.5em] mt-1 text-glitch-magenta">UNAUTHORIZED_ACCESS_DETECTED</p>
             </div>
             <ShieldAlert size={32} className="text-glitch-magenta animate-bounce" />
          </header>

          <div className="flex justify-center p-8 bg-black/40 border-y border-glitch-dim relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(90deg,var(--color-glitch-cyan)_1px,transparent_1px),linear-gradient(var(--color-glitch-cyan)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <SnakeGame 
              score={score} 
              setScore={setScore} 
              highScore={highScore} 
              setHighScore={setHighScore}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
            />
          </div>

          <MusicPlayer 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            progress={progress}
            setProgress={setProgress}
            nextTrack={nextTrack}
            prevTrack={prevTrack}
          />
        </main>

        {/* RIGHT COMPARTMENT: SYSTEM_LOGS */}
        <aside className="flex flex-col gap-6">
          <div className="panel-border bg-black p-4 flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-glitch-magenta pb-2">
              <Activity size={18} className="text-glitch-magenta" />
              <h2 className="text-lg font-black uppercase tracking-tighter glitch-text" data-text="SYSTEM_STATS">SYSTEM_STATS</h2>
            </div>
            
            <div className="space-y-8">
              <div className="relative group">
                <div className="text-[9px] text-glitch-dim uppercase tracking-[0.3em] mb-1 font-bold">GRID_SCORE</div>
                <div className="text-5xl font-mono text-white glitch-text leading-none" data-text={score.toString().padStart(5, '0')}>
                  {score.toString().padStart(5, '0')}
                </div>
              </div>

              <div className="relative group">
                <div className="text-[9px] text-glitch-dim uppercase tracking-[0.3em] mb-1 font-bold">PEAK_RECORD</div>
                <div className="text-4xl font-mono text-glitch-magenta leading-none">
                  {highScore.toString().padStart(5, '0')}
                </div>
              </div>
            </div>
          </div>

          <div className="panel-border bg-black p-4 flex flex-col gap-4 overflow-hidden h-full">
            <div className="flex items-center gap-2 border-b border-glitch-cyan pb-2">
              <Terminal size={16} className="text-glitch-cyan" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-glitch-cyan">CMD_TERMINAL</span>
            </div>
            
            <div className="flex flex-col gap-2 font-mono text-[9px] text-glitch-dim custom-scrollbar h-[200px] overflow-y-auto">
              <p className="text-glitch-cyan">{">"} INITIALIZING_GRID...</p>
              <p className="text-glitch-magenta">{">"} WARNING: PKT_LOSS DETECTED</p>
              <p>{">"} MEM_CLEANUP: 0x4F2A</p>
              <p>{">"} SYNCING_SONIC_FEED: 144Hz</p>
              <p className="text-white">{">"} SCORE_INC: +10</p>
              <p className="animate-pulse">{">"} _WAITING_FOR_INPUT...</p>
              <p>{">"} GRID_STABILITY: 94.2%</p>
              <p className="text-glitch-magenta">{">"} CRITICAL_OVERHEAT_ERR</p>
              <p>{">"} BYPASSING_SECURITY_LAYER_3</p>
            </div>
          </div>
        </aside>

      </div>

      {/* Floating Branded Element */}
      <footer className="fixed bottom-4 left-4 flex flex-col gap-0 text-[10px] font-black uppercase tracking-tighter text-glitch-dim opacity-40">
        <span>VER: [NUL_VOID]</span>
        <span>AUTH: MACHINE_01</span>
      </footer>

      {/* Tearing overlay */}
      <div className="fixed top-1/4 left-0 w-full h-4 bg-glitch-cyan/10 tearing -z-10" />
      <div className="fixed bottom-1/3 left-0 w-full h-8 bg-glitch-magenta/5 tearing -z-10" />
    </div>
  );
}
