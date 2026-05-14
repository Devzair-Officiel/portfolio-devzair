import type { IconType } from 'react-icons'
import {
  SiReact, SiTypescript, SiDocker, SiPhp, SiSymfony,
  SiTailwindcss, SiGit, SiVite, SiFramer,
  SiJavascript, SiSass, SiBootstrap, SiHtml5, SiNodedotjs,
} from 'react-icons/si'

interface MarqueeItem {
  label: string
  icon: IconType
  color: string
}

const ITEMS: MarqueeItem[] = [
  { label: 'React',         icon: SiReact,       color: '#61dafb' },
  { label: 'TypeScript',    icon: SiTypescript,  color: '#3178c6' },
  { label: 'Docker',        icon: SiDocker,      color: '#2496ed' },
  { label: 'PHP',           icon: SiPhp,         color: '#777bb4' },
  { label: 'Symfony',       icon: SiSymfony,     color: '#ffffff' },
  { label: 'Tailwind CSS',  icon: SiTailwindcss, color: '#06b6d4' },
  { label: 'Git',           icon: SiGit,         color: '#f05032' },
  { label: 'Vite',          icon: SiVite,        color: '#646cff' },
  { label: 'Framer Motion', icon: SiFramer,      color: '#ffffff' },
  { label: 'JavaScript',    icon: SiJavascript,  color: '#f7df1e' },
  { label: 'SCSS',          icon: SiSass,        color: '#cc6699' },
  { label: 'Bootstrap',     icon: SiBootstrap,   color: '#7952b3' },
  { label: 'HTML / CSS',    icon: SiHtml5,       color: '#e34f26' },
  { label: 'Node.js',       icon: SiNodedotjs,   color: '#339933' },
]

const DOTS = ['#8b5cf6', '#06b6d4', '#f43f5e']

export const Marquee = () => (
  <div
    className="relative overflow-hidden py-5"
    style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
    }}
  >
    <div
      className="flex"
      style={{ animation: 'marquee-scroll 30s linear infinite', willChange: 'transform' }}
    >
      {[...ITEMS, ...ITEMS].map((item, i) => {
        const Icon = item.icon
        return (
          <span
            key={i}
            className="flex items-center gap-2.5 px-7 whitespace-nowrap text-xs font-bold uppercase"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.18em' }}
          >
            <Icon size={16} style={{ color: item.color, flexShrink: 0 }} />
            {item.label}
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
        )
      })}
    </div>
  </div>
)
