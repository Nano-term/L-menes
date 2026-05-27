import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Modal de creación de mensajes. Inputs: nombre (opcional), para (opcional),
 * mensaje (obligatorio). Si nombre/para están vacíos: "Anónimo" / "General".
 */
export default function CreateMessageModal({ open, onClose, onSubmit }) {
  const [nombre, setNombre] = useState('');
  const [para, setPara] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Reset al cerrar.
  useEffect(() => {
    if (!open) {
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  // ESC para cerrar + bloquear scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, submitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      setError('Escribe algo lindo antes de enviarlo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await onSubmit({ nombre, para, mensaje });
    setSubmitting(false);
    if (result.success) {
      // Limpiar campos y cerrar.
      setNombre('');
      setPara('');
      setMensaje('');
      onClose();
    } else {
      setError(result.error || 'Algo salió mal. Intenta de nuevo.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => !submitting && onClose()}
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
            className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl glass-strong ring-glow"
          >
            {/* Cerrar */}
            <button
              onClick={() => !submitting && onClose()}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition disabled:opacity-50"
              aria-label="Cerrar"
              disabled={submitting}
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSubmit} className="p-8 md:p-10">
              <div className="mb-8">
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-glow/70 mb-2">
                  nuevo mensaje
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-gradient leading-tight">
                  Deja algo para alguien.
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Una palabra, un recuerdo, un gracias. Puede ser anónimo.
                </p>
              </div>

              <div className="space-y-5">
                {/* Nombre */}
                <Field
                  label="Tu nombre"
                  hint="déjalo vacío para firmar como Anónimo"
                  htmlFor="nombre"
                >
                  <input
                    id="nombre"
                    type="text"
                    maxLength={60}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="ej. Carla R."
                    className="input-glass"
                    disabled={submitting}
                  />
                </Field>

                {/* Para */}
                <Field
                  label="Para"
                  hint='déjalo vacío para enviarlo a "General"'
                  htmlFor="para"
                >
                  <input
                    id="para"
                    type="text"
                    maxLength={80}
                    value={para}
                    onChange={(e) => setPara(e.target.value)}
                    placeholder="ej. Maestro Ramírez"
                    className="input-glass"
                    disabled={submitting}
                  />
                </Field>

                {/* Mensaje */}
                <Field label="Tu mensaje" hint="lo importante" htmlFor="mensaje" required>
                  <textarea
                    id="mensaje"
                    rows={6}
                    maxLength={2000}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Gracias por enseñarnos que el código también puede ser bonito…"
                    className="input-glass resize-none"
                    disabled={submitting}
                    required
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-mono text-slate-500">
                      {mensaje.length} / 2000
                    </span>
                  </div>
                </Field>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-rose-300 font-mono"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !submitting && onClose()}
                    className="btn-ghost"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={submitting || !mensaje.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Enviando…
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Publicar en el muro
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, hint, htmlFor, required, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300">
          {label} {required && <span className="text-cyan-glow">*</span>}
        </span>
        {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
