import { useEffect, useRef } from 'react'

export const Background = () => {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return
      glowRef.current.style.left = `${e.clientX}px`
      glowRef.current.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Cursor glow follower */}
      <div ref={glowRef} className="cursor-glow" />

      {/* Fixed mesh gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        {/* Orb 1 — violet haut-gauche */}
        <div
          className="orb-1 absolute rounded-full blur-[120px]"
          style={{
            width: '700px',
            height: '700px',
            top: '-150px',
            left: '-100px',
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
            opacity: 0.18,
          }}
        />
        {/* Orb 2 — cyan haut-droit */}
        <div
          className="orb-2 absolute rounded-full blur-[140px]"
          style={{
            width: '600px',
            height: '600px',
            top: '-80px',
            right: '-80px',
            background: 'radial-gradient(circle, #0e7490 0%, transparent 70%)',
            opacity: 0.14,
          }}
        />
        {/* Orb 3 — rose bas-centre */}
        <div
          className="orb-3 absolute rounded-full blur-[160px]"
          style={{
            width: '800px',
            height: '800px',
            bottom: '-200px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, #be185d 0%, transparent 70%)',
            opacity: 0.10,
          }}
        />
        {/* Orb 4 — violet bas-droite (statique) */}
        <div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: '400px',
            height: '400px',
            bottom: '10%',
            right: '-50px',
            background: 'radial-gradient(circle, #6d28d9 0%, transparent 70%)',
            opacity: 0.12,
          }}
        />

        {/* Noise texture subtile */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundSize: '200px',
          }}
        />
      </div>
    </>
  )
}
