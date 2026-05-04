export const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      {/* Halo principal — Hero */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '600px',
          height: '600px',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, #7c6fff 0%, transparent 70%)',
          opacity: 'var(--halo-primary, 0.2)',
        }}
      />
      {/* Halo gauche */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          top: '40%',
          left: '-100px',
          background: 'radial-gradient(circle, #7c6fff 0%, transparent 70%)',
          opacity: 'var(--halo-secondary, 0.1)',
        }}
      />
      {/* Halo droit */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          top: '60%',
          right: '-100px',
          background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)',
          opacity: 'var(--halo-secondary, 0.1)',
        }}
      />
      {/* Halo bas */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, #7c6fff 0%, transparent 70%)',
          opacity: 'var(--halo-secondary, 0.1)',
        }}
      />
    </div>
  )
}
