import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Track } from '@/src/types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Virtual',
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_3380df1110.mp3', // Synthwave
    color: 'rgb(34, 211, 238)', // Cyan
  },
  {
    id: '2',
    title: 'Midnight Grid',
    artist: 'Synthwave Bot',
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_1067160759.mp3', // Lo-fi/Retro
    color: 'rgb(168, 85, 247)', // Purple
  },
  {
    id: '3',
    title: 'Deep Space Echo',
    artist: 'Lunar AI',
    url: 'https://cdn.pixabay.com/audio/2022/01/26/audio_d0c6ff1101.mp3', // Ambient/Electronic
    color: 'rgb(244, 63, 94)', // Rose
  },
  {
    id: '4',
    title: 'Cyber Drift',
    artist: 'Vector Runner',
    url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_985538f0d9.mp3', // Retro Cyber
    color: 'rgb(34, 197, 94)', // Green
  },
  {
    id: '5',
    title: 'Digital Horizon',
    artist: 'Proxy Alpha',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_88458e6947.mp3', // Uplifting Electronic
    color: 'rgb(245, 158, 11)', // Amber
  },
  {
    id: '6',
    title: 'Glitch City',
    artist: 'Error 404',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_b2512f4305.mp3', // Glitchy Beats
    color: 'rgb(255, 255, 255)', // White
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl w-full max-w-md mx-auto relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 blur-[100px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 relative z-10">
        {/* Album Art Placeholder */}
        <motion.div 
          key={currentTrack.id}
          initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${currentTrack.color}44, ${currentTrack.color}11)`,
            border: `1px solid ${currentTrack.color}33`
          }}
        >
          <Music2 className="w-10 h-10" style={{ color: currentTrack.color }} />
          {isPlaying && (
             <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: currentTrack.color }}
             />
          )}
        </motion.div>

        <div className="flex-1">
          <motion.div 
            key={currentTrack.title}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h3 className="text-xl font-bold text-white tracking-tight">{currentTrack.title}</h3>
            <p className="text-slate-400 text-sm font-medium">{currentTrack.artist}</p>
          </motion.div>

          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={prevTrack}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-white text-slate-900 rounded-full hover:scale-105 transition-transform shadow-lg shadow-white/10"
            >
              {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
            </button>
            <button 
              onClick={nextTrack}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ 
                backgroundColor: currentTrack.color,
                boxShadow: `0 0 10px ${currentTrack.color}`,
                width: `${progress}%` 
            }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            <span>Progress</span>
            <div className="flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>AI Mastering Active</span>
            </div>
        </div>
      </div>
    </div>
  );
};
