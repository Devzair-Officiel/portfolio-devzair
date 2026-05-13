import { useMotionValue, useSpring, motion } from 'framer-motion'
import { useEffect } from 'react'

export const Background = () => {
  const rawX = useMotionValue(-1000)
  const rawY = useMotionValue(-1000)
  const x = useSpring(rawX, { stiffness: 60, damping: 20 })
  const y = useSpring(rawY, { stiffness: 60, damping: 20 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      rawX.set(e.clientX - 250)
      rawY.set(e.clientY - 250)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [rawX, rawY])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      {/* Orb 1 — violet, haut gauche */}
      <div
        className="orb-1 absolute rounded-full blur-3xl"
        style={{
          width: '700px', height: '700px',
          top: '-200px', left: '-150px',
          background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 65%)',
        }}
      />

      {/* Orb 2 — cyan, bas droite */}
      <div
        className="orb-2 absolute rounded-full blur-3xl"
        style={{
          width: '600px', height: '600px',
          bottom: '-150px', right: '-100px',
          background: 'radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 65%)',
        }}
      />

      {/* Orb 3 — rose, milieu gauche */}
      <div
        className="orb-3 absolute rounded-full blur-3xl"
        style={{
          width: '450px', height: '450px',
          top: '35%', left: '-80px',
          background: 'radial-gradient(circle, rgba(244,114,182,0.22) 0%, transparent 65%)',
        }}
      />

      {/* Orb 4 — violet clair, haut droite */}
      <div
        className="orb-4 absolute rounded-full blur-3xl"
        style={{
          width: '380px', height: '380px',
          top: '-60px', right: '-60px',
          background: 'radial-gradient(circle, rgba(192,132,252,0.25) 0%, transparent 65%)',
        }}
      />

      {/* Grille de points subtile */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.04) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Cursor glow — spring fluide */}
      <motion.div
        style={{
          x, y,
          width: '500px', height: '500px',
          position: 'absolute',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
