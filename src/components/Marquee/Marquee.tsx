const ITEMS = [
  'React', 'TypeScript', 'Docker', 'PHP', 'Symfony',
  'Tailwind CSS', 'Git', 'Vite', 'Framer Motion',
  'JavaScript', 'SCSS', 'Bootstrap', 'HTML / CSS', 'Node.js',
]

const DOTS = ['#8b5cf6', '#06b6d4', '#f43f5e']

export const Marquee = () => (
  <div
    className="relative overflow-hidden py-5"
    style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
    }}
  >
    <div
      className="flex"
      style={{ animation: 'marquee-scroll 30s linear infinite', willChange: 'transform' }}
    >
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-5 px-7 whitespace-nowrap text-xs font-bold uppercase"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.18em' }}
        >
          {item}
          <span
            style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: DOTS[i % 3],
              flexShrink: 0,
              boxShadow: `0 0 6px ${DOTS[i % 3]}`,
            }}
          />
        </span>
      ))}
    </div>
  </div>
)
