import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, Headphones } from 'lucide-react';
import { useState } from 'react';

/**
 * Reproductor ambiental flotante. Estado colapsado = pill pequeña.
 * Expandido al hacer click = controles completos.
 *
 * Props (todo viene de useMusicPlayer):
 *   - hasTracks, activated, isPlaying, volume, currentTrack
 *   - activate(), toggle(), next(), setVolume(v)
 */
export default function MusicPlayer({
  hasTracks,
  activated,
  isPlaying,
  volume,
  currentTrack,
  activate,
  toggle,
  next,
  setVolume,
}) {
  const [expanded, setExpanded] = useState(false);

  if (!hasTracks) return null;

  // -------------- Modo NO activado: muestra solo "Activar ambiente" --------------
  if (!activated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-40"
      >
        <button
          onClick={activate}
          className="group inline-flex items-center gap-2 px-4 py-3 rounded-full glass border border-cyan-glow/20 text-slate-200 text-sm hover:border-cyan-glow/50 transition-all"
        >
          <Headphones size={16} className="text-cyan-glow" />
          <span className="hidden sm:inline">Activar ambiente</span>
          <span className="sm:hidden">Ambiente</span>
        </button>
      </motion.div>
    );
  }

  // -------------- Modo activado: pill colapsable --------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-40"
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl glass-strong p-4 ring-glow w-72"
          >
            {/* Header con título de canción */}
            <div className="flex items-center gap-3 mb-3 pr-2">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{
                  duration: 6,
                  repeat: isPlaying ? Infinity : 0,
                  ease: 'linear',
                }}
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-plum-500/40 to-cyan-glow/40 border border-white/10"
              >
                <Music size={14} className="text-cyan-glow" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                  reproduciendo
                </p>
                <p className="text-sm text-slate-100 truncate font-serif italic">
                  {currentTrack?.title || '—'}
                </p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-slate-500 hover:text-slate-200 text-xs font-mono shrink-0"
                aria-label="Colapsar reproductor"
              >
                —
              </button>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={toggle}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-100 transition"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span className="text-xs">{isPlaying ? 'Pausar' : 'Reproducir'}</span>
              </button>
              <button
                onClick={next}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-slate-100 transition"
                aria-label="Siguiente canción"
              >
                <SkipForward size={14} />
              </button>
            </div>

            {/* Volumen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.55)}
                className="text-slate-400 hover:text-slate-100 transition"
                aria-label="Silenciar"
              >
                {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-glow h-1"
                aria-label="Volumen"
              />
              <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
                {Math.round(volume * 100)}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full glass border border-white/10 hover:border-cyan-glow/30 text-slate-200 text-sm transition-all"
          >
            <motion.span
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 6, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
              className="inline-flex"
            >
              <Music size={14} className="text-cyan-glow" />
            </motion.span>
            <span className="max-w-[140px] truncate hidden sm:inline">
              {currentTrack?.title || 'Ambiente'}
            </span>
            <span className="sm:hidden">{isPlaying ? '♪' : 'II'}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
