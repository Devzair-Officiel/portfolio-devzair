import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { ProjectType } from '@/types'

interface Props {
  project: ProjectType
  index: number
}

const ACCENT_CYCLE = ['#a78bfa', '#22d3ee', '#f472b6', '#fbbf24', '#c084fc', '#a78bfa']

export const ProjectCard = ({ project, index }: Props) => {
  const { t } = useTranslation()
  const accent = ACCENT_CYCLE[index % ACCENT_CYCLE.length]
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '800px' }}
      className="h-full"
    >
      <article className="glass-card flex flex-col h-full">
        {/* Accent line top */}
        <div style={{ height: '2px', background: `linear-gradient(90deg, ${accent}, transparent)` }} />

        {/* Contenu */}
        <div className="p-6 flex flex-col gap-5 flex-1">
          {/* Index + titre */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: accent,
                opacity: 0.7,
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3
              className="mt-1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '-0.01em',
              }}
            >
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p
            className="text-sm flex-1"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 1.7 }}
          >
            {project.description}
          </p>

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map(tech => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs rounded-md"
                style={{
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div
            className="flex gap-4 pt-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1.5 transition-colors duration-150"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = accent)}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.755-1.755-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {t('projects.github')}
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1.5 transition-colors duration-150"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = accent)}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {t('projects.live')}
              </a>
            )}
          </div>
        </div>
      </article>
    </motion.div>
  )
}
