import { motion } from 'framer-motion';
import { LogOut, ShieldCheck } from 'lucide-react';

/**
 * Encabezado con el logo "lúmenes." — el punto final es la zona secreta
 * para activar el modo admin. Hay que tocarlo 3 veces seguidas.
 *
 * Props:
 *  - onSecretTap: callback que se invoca cuando se toca el "punto"
 *  - isAdmin: si está activo el modo admin (muestra badge + logout)
 *  - onLogout: callback para cerrar la sesión admin
 */
export default function Header({ onSecretTap, isAdmin, onLogout, totalMessages }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative pt-10 pb-6 px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6 md:gap-8">
        {/* Etiqueta superior */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full glass text-[11px] tracking-[0.25em] uppercase text-cyan-glow/80 font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow animate-glow-pulse" />
          Pensamientos e Historias · 2026
        </motion.div>

        {/* Logo principal */}
        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl leading-none tracking-tight flex items-baseline">
          <span className="text-gradient">lúmenes</span>
          {/* Punto secreto — zona de admin */}
          <button
            type="button"
            aria-label="punto"
            onClick={onSecretTap}
            className="relative ml-1 cursor-default focus:outline-none group"
            // El cursor 'default' evita pistas visuales del easter egg.
          >
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-glow shadow-[0_0_24px_6px_rgba(126,232,250,0.55)]"
            />
          </button>
        </h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-xl text-balance text-slate-300/90 font-serif italic text-lg md:text-xl leading-relaxed"
        >
          — Un pequeño espacio para dejarles algo a quienes nos enseñan a construir software ...y nos hacen sufrir tantito —
          
        </motion.p>

        {/* Metadato + admin badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-400"
        >
          <span className="px-3 py-1 rounded-full glass">
            {totalMessages} {totalMessages === 1 ? 'mensaje' : 'mensajes'} en el muro
          </span>
          <span className="px-3 py-1 rounded-full glass">Ingeniería en Software</span>

          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow"
            >
              <ShieldCheck size={12} />
              modo admin
              <button
                onClick={onLogout}
                className="ml-1 opacity-70 hover:opacity-100 transition"
                aria-label="Cerrar sesión admin"
              >
                <LogOut size={12} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}
