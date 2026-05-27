import { motion } from 'framer-motion';

/**
 * Fondo animado: malla de gradientes + orbes flotantes + grano sutil.
 *
 * Es 100% decorativo: pointer-events-none y fixed inset-0.
 * Las animaciones son lentas y de baja intensidad para no marear.
 */
export default function ParticleBackground() {
  // Posiciones predeterminadas para que el resultado sea visualmente
  // equilibrado en lugar de aleatorio cada render.
  const orbs = [
    { size: 480, top: '-10%', left: '-8%', color: 'rgba(109, 90, 205, 0.35)', delay: 0 },
    { size: 380, top: '20%', right: '-6%', color: 'rgba(126, 232, 250, 0.22)', delay: 2 },
    { size: 520, bottom: '-12%', left: '20%', color: 'rgba(167, 139, 250, 0.28)', delay: 4 },
    { size: 320, bottom: '15%', right: '12%', color: 'rgba(136, 211, 206, 0.20)', delay: 1 },
    { size: 260, top: '52%', left: '46%', color: 'rgba(255, 193, 214, 0.14)', delay: 3 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base sólida */}
      <div className="absolute inset-0 bg-midnight-50" />

      {/* Malla de gradientes animada */}
      <div className="absolute inset-0 bg-mesh opacity-90" />

      {/* Orbes flotantes con blur */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Grano / ruido para textura tipo film */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: '200px 200px',
        }}
      />

      {/* Viñeta superior e inferior */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-50/40 via-transparent to-midnight-50/60" />
    </div>
  );
}
