import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Modal de acceso a modo administrador.
 *
 * Props:
 *  - open: boolean
 *  - onClose: cerrar
 *  - onSubmit: (password) => boolean — true si la contraseña es correcta
 */
export default function AdminLoginModal({ open, onClose, onSubmit }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  useEffect(() => {
    if (!open) {
      setPassword('');
      setError(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = onSubmit(password);
    if (!ok) {
      setError(true);
      setShake((s) => s + 1);
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(5, 6, 18, 0.7)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <motion.div
            key={shake}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: error ? [0, -10, 10, -8, 8, -4, 4, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{
              duration: 0.4,
              ease: [0.21, 0.47, 0.32, 0.98],
              x: { duration: 0.5 },
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl glass-strong ring-glow overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-glow/30 blur-xl animate-glow-pulse" />
                  <div className="relative w-14 h-14 rounded-full glass flex items-center justify-center border border-cyan-glow/30">
                    <ShieldCheck className="text-cyan-glow" size={22} />
                  </div>
                </div>
              </div>

              <h2 className="font-serif text-2xl text-center text-gradient mb-1">
                Acceso restringido
              </h2>
              <p className="text-center text-xs text-slate-400 font-mono mb-6">
                ingresa la contraseña de administrador
              </p>

              <div className="relative mb-4">
                <Lock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  className="input-glass pl-11 font-mono"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-rose-300 font-mono text-center mb-4">
                  contraseña incorrecta
                </p>
              )}

              <button
                type="submit"
                disabled={!password}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Entrar
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
