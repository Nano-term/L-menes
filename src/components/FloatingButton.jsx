import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

/**
 * Botón flotante grande, sticky en la esquina inferior derecha.
 * Tiene un anillo de luz pulsante para llamar la atención.
 */
export default function FloatingButton({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.6, ease: 'backOut' }}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40"
    >
      <div className="relative">
        {/* Glow detrás */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-cyan-glow/40 blur-xl"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-midnight-50 shadow-glow-cyan transition-shadow"
          style={{
            background:
              'linear-gradient(135deg, #7ee8fa 0%, #a78bfa 60%, #ffc1d6 100%)',
          }}
          aria-label="Escribir un nuevo mensaje"
        >
          <Plus size={26} strokeWidth={2.4} />

          {/* Anillo decorativo */}
          <span className="absolute inset-0 rounded-full border border-white/30" />
        </motion.button>
      </div>
    </motion.div>
  );
}
