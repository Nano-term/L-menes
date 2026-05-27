import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function EmptyState({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="max-w-md mx-auto text-center py-20 px-6"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass mb-6 ring-glow">
        <Sparkles className="text-cyan-glow" size={22} />
      </div>
      <h3 className="font-serif text-3xl text-gradient mb-3">
        El muro está vacío
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-8">
        Sé la primera persona en dejar un mensaje. Una palabra de cariño, un recuerdo,
        un agradecimiento — lo que sientas.
      </p>
      <button onClick={onCreate} className="btn-primary">
        <Sparkles size={15} />
        Escribir el primero
      </button>
    </motion.div>
  );
}
