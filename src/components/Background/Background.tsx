import { useEffect, useRef } from 'react'

export const Background = () => {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!glowRef.current) return
      glowRef.current.style.left = `${e.clientX - 200}px`
      glowRef.current.style.top  = `${e.clientY - 200}px`
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden>
      {/* Orb 1 — indigo, haut gauche */}
      <div
        className="orb-1 absolute rounded-full blur-3xl"
        style={{
          width: '700px',
          height: '700px',
          top: '-200px',
          left: '-150px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Orb 2 — violet, bas droite */}
      <div
        className="orb-2 absolute rounded-full blur-3xl"
        style={{
          width: '600px',
          height: '600px',
          bottom: '-150px',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(192,132,252,0.14) 0%, transparent 65%)',
        }}
      />

      {/* Orb 3 — cyan, centre */}
      <div
        className="orb-3 absolute rounded-full blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          top: '40%',
          left: '40%',
          background: 'radial-gradient(circle, rgba(103,232,249,0.09) 0%, transparent 65%)',
        }}
      />

      {/* Grille fine */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(129,140,248,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="absolute rounded-full blur-3xl transition-[left,top] duration-700 ease-out"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
