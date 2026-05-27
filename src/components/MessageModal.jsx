import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

/**
 * Modal de vista ampliada de un mensaje. Diseño tipo "carta abierta".
 *
 * Props:
 *  - message: el mensaje (null = cerrado)
 *  - onClose: cerrar
 *  - isAdmin: muestra eliminar
 *  - onDelete: eliminar mensaje
 */
export default function MessageModal({ message, onClose, isAdmin, onDelete }) {
  // Cerrar con ESC.
  useEffect(() => {
    if (!message) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Bloquear scroll del body.
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{
            background: 'rgba(5, 6, 18, 0.7)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl glass-strong ring-glow"
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="flex items-start gap-2 mb-8">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-glow/70 mb-2">
                    para
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl text-gradient leading-tight break-words">
                    {message.para}
                  </h2>
                </div>
              </div>

              {/* Separador */}
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-glow/30 to-transparent mb-8" />

              {/* Cuerpo */}
              <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap break-words font-serif italic">
                "{message.mensaje}"
              </p>

              {/* Footer */}
              <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 mb-1">
                    de
                  </p>
                  <p className="font-serif text-xl text-slate-100">{message.nombre}</p>
                </div>
                <time className="text-xs font-mono text-slate-400">
                  {formatDateFull(message.created_at)}
                </time>
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div className="mt-8 pt-6 border-t border-rose-400/20 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-xs text-slate-400 font-mono">acciones de administrador</p>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          '¿Eliminar este mensaje permanentemente? Esta acción no se puede deshacer.'
                        )
                      ) {
                        onDelete(message.id);
                        onClose();
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-rose-400/10 border border-rose-400/30 text-rose-200 hover:bg-rose-400/20 transition"
                  >
                    <Trash2 size={14} />
                    Eliminar mensaje
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatDateFull(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
