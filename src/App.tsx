import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Gamepad2, Headphones, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-rose-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 pointer-events-none" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Info & Assets */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 space-y-4"
          >
            <div className="flex items-center gap-3 text-cyan-400">
                <Gamepad2 className="w-6 h-6" />
                <h1 className="text-xl font-black tracking-tighter uppercase italic">Neon Rhythm</h1>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              A sensory fusion of rhythm and reflex. Navigate the grid as the pulse evolves.
            </p>
            <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    <span>Engine Status</span>
                    <span className="text-cyan-400">Nominal</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    <span>Latency</span>
                    <span className="text-emerald-400">0.4ms</span>
                </div>
            </div>
          </motion.div>

          <MusicPlayer />
        </div>

        {/* Center: Game Window */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-full"
            >
                <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Grid_Segment_01</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Live Feed</span>
                    </div>
                </div>
                <SnakeGame />
            </motion.div>
        </div>

        {/* Right Panel: Credits & Stats */}
        <div className="lg:col-span-3 space-y-8 order-3">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5"
          >
            <div className="flex items-center gap-3 text-rose-500 mb-4">
                <Headphones className="w-6 h-6" />
                <h2 className="text-lg font-black tracking-tighter uppercase italic">Session Metrics</h2>
            </div>
            <div className="space-y-6">
                <div>
                   <div className="flex justify-between text-xs text-slate-500 font-mono mb-2 uppercase">
                        <span>Intensity</span>
                        <span>84%</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "84%" }}
                            className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        />
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-xs text-slate-500 font-mono mb-2 uppercase">
                        <span>Sync Rate</span>
                        <span>99.2%</span>
                   </div>
                   <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "99.2%" }}
                            className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        />
                   </div>
                </div>
            </div>
          </motion.div>

          <footer className="text-center lg:text-left px-4">
            <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest leading-loose">
                Designed for optimal sensory experience.<br/>
                Proprietary AI sequence v.04-29.<br/>
                &copy; 2026 Neon Dynamics.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
