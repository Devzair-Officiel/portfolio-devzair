import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  tx: number
  ty: number
  color: string
}

const COLORS = ['#ffffff', '#c4b5fd', '#67e8f9', '#a78bfa', '#ffffff', '#ffffff']

// Généré une seule fois au chargement du module — stable entre les renders
const STARS: Star[] = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.55 + 0.1,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 5,
  tx: (Math.random() - 0.5) * 28,
  ty: (Math.random() - 0.5) * 28,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
}))

export const StarField = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    {STARS.map(star => (
      <motion.div
        key={star.id}
        className="absolute rounded-full"
        style={{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: star.size,
          height: star.size,
          background: star.color,
          boxShadow: star.size > 2 ? `0 0 ${star.size * 3}px ${star.color}` : 'none',
        }}
        animate={{
          x: [0, star.tx, 0],
          y: [0, star.ty, 0],
          opacity: [star.opacity, star.opacity * 0.2, star.opacity],
          scale: [1, star.size > 1.5 ? 1.4 : 1.1, 1],
        }}
        transition={{
          duration: star.duration,
          delay: star.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
)
