import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

/**
 * Tarjeta individual de mensaje. Diseñada para verse bonita en un grid masonry.
 *
 * Props:
 *  - message: { id, nombre, para, mensaje, created_at }
 *  - onClick: callback para abrir la vista ampliada
 *  - isAdmin: si está en modo admin (muestra botón eliminar)
 *  - onDelete: callback para eliminar
 *  - index: para animaciones escalonadas al cargar
 */
export default function MessageCard({ message, onClick, isAdmin, onDelete, index = 0 }) {
  const { id, nombre, para, mensaje, created_at } = message;

  const formattedDate = formatDate(created_at);

  // Variación sutil de "matiz" según el id, para que las tarjetas no se vean idénticas.
  const accentHue = hashToHue(id || '');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      onClick={() => onClick(message)}
      className="group relative cursor-pointer rounded-3xl glass shadow-card hover:shadow-card-hover transition-shadow duration-500 overflow-hidden"
      style={{
        // Tinte muy sutil único por tarjeta
        backgroundImage: `linear-gradient(135deg, hsla(${accentHue}, 70%, 70%, 0.04) 0%, transparent 60%)`,
      }}
    >
      {/* Línea de luz superior */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, hsla(${accentHue}, 90%, 75%, 0.6), transparent)`,
        }}
      />

      <div className="relative p-6 md:p-7 flex flex-col gap-4">
        {/* "Para" — destacado */}
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">
              para
            </p>
            <h3 className="font-serif text-xl md:text-2xl text-slate-100 truncate">
              {para}
            </h3>
          </div>

          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('¿Eliminar este mensaje? Esta acción no se puede deshacer.')) {
                  onDelete(id);
                }
              }}
              className="shrink-0 p-2 rounded-full text-rose-300 hover:bg-rose-400/15 hover:text-rose-200 transition opacity-0 group-hover:opacity-100"
              aria-label="Eliminar mensaje"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {/* Mensaje (truncado) */}
        <p className="text-slate-300/95 leading-relaxed text-[15px] line-clamp-6 whitespace-pre-wrap break-words">
          {mensaje}
        </p>

        {/* Footer: nombre + fecha */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/5">
          <span className="text-sm text-slate-400 italic font-serif truncate max-w-[60%]">
            — {nombre}
          </span>
          <time className="text-[11px] font-mono text-slate-500 shrink-0">
            {formattedDate}
          </time>
        </div>
      </div>

      {/* Glow al hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), hsla(${accentHue}, 80%, 70%, 0.08), transparent 40%)`,
        }}
      />
    </motion.article>
  );
}

// --------- Helpers ---------

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHr < 24) return `hace ${diffHr} h`;
  if (diffDays < 7) return `hace ${diffDays} d`;

  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function hashToHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  // Mantenerlo dentro del rango cyan/morado/rosa para no salir de la paleta
  const ranges = [
    [180, 210], // cyan
    [255, 285], // violeta
    [320, 345], // rosa
  ];
  const pick = ranges[h % ranges.length];
  return pick[0] + (h % (pick[1] - pick[0]));
}
