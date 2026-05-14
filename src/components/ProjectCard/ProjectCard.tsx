import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { ProjectType } from '@/types'

interface Props {
  project: ProjectType
  accentColor?: string
  index: number
  isActive?: boolean
}

export const ProjectCard = ({ project, accentColor = '#8b5cf6', index, isActive = false }: Props) => {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')
  const lit = hovered || isActive

  return (
    <div
      className="h-full rounded-2xl p-px"
      style={{
        background: lit
          ? `linear-gradient(135deg, ${accentColor}, ${accentColor}60 40%, ${accentColor}20 70%, transparent)`
          : `linear-gradient(135deg, ${accentColor}30, transparent 60%)`,
        transition: 'background 0.4s ease',
        boxShadow: isActive ? `0 0 40px ${accentColor}30` : 'none',
      }}
    >
      <motion.article
        className="relative h-full rounded-2xl overflow-hidden cursor-default"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* ── Background image or fallback ────────────────── */}
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: lit ? 'scale(1.07)' : 'scale(1)',
              filter: lit ? 'brightness(0.3) saturate(1.3)' : 'brightness(0.65)',
              transition: 'transform 0.6s ease, filter 0.5s ease',
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(150deg, ${accentColor}25 0%, var(--surface-alt) 60%, ${accentColor}10 100%)` }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundImage: `repeating-linear-gradient(55deg, ${accentColor}12 0px, ${accentColor}12 1px, transparent 1px, transparent 22px)` }}
            />
            <div
              className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentColor}35, transparent 65%)` }}
            />
            <div
              className="absolute bottom-0 -left-8 w-36 h-36 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentColor}18, transparent 65%)` }}
            />
            <span
              className="absolute right-2 bottom-0 font-black leading-none select-none pointer-events-none"
              style={{
                fontSize: '8.5rem',
                color: accentColor,
                opacity: hovered ? 0.04 : 0.12,
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
                transition: 'opacity 0.4s',
              }}
            >
              {num}
            </span>
          </div>
        )}

        {/* ── Top accent bar ───────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: '3px',
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80, transparent)`,
            opacity: lit ? 1 : 0.5,
            transition: 'opacity 0.3s',
          }}
        />

        {/* ── Number badge ─────────────────────────────────── */}
        <div className="absolute top-3 left-4 z-10">
          <span
            className="text-xs font-black px-2.5 py-1 rounded-full tracking-widest uppercase"
            style={{
              background: `${accentColor}25`,
              border: `1px solid ${accentColor}55`,
              color: accentColor,
              backdropFilter: 'blur(8px)',
              letterSpacing: '0.15em',
            }}
          >
            {num}
          </span>
        </div>

        {/* ── Overlay gradient ─────────────────────────────── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: lit
              ? `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, ${accentColor}15 100%)`
              : `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)`,
            transition: 'background 0.45s ease',
          }}
        />

        {/* ── Default: title only ──────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 z-20"
          style={{
            opacity: lit ? 0 : 1,
            transform: lit ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 0.28s ease, transform 0.32s ease',
            pointerEvents: 'none',
          }}
        >
          <h3
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)', color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            {project.title}
          </h3>
        </div>

        {/* ── Hover: full content ──────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-6 z-20"
          style={{
            opacity: lit ? 1 : 0,
            transform: lit ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.38s ease, transform 0.42s ease',
            pointerEvents: lit ? 'auto' : 'none',
          }}
        >
          {/* Content: title + description + stack */}
          <div className="flex flex-col gap-4">
            <h3
              className="text-3xl font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: '#fff' }}
            >
              {project.title}
            </h3>

            <p
              className="text-base leading-loose"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              {project.description}
            </p>

            {/* Stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map(tech => (
                <span
                  key={tech}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: `${accentColor}22`,
                    border: `1px solid ${accentColor}45`,
                    color: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: accentColor }}
                  />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs — grand espace au-dessus */}
          <div className="flex gap-2 mt-10">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-opacity hover:opacity-85"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  color: '#fff',
                  boxShadow: `0 4px 18px ${accentColor}55`,
                }}
              >
                {t('projects.live')}
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M4.5 4.5h15v15" />
                </svg>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.755-1.755-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {t('projects.github')}
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  )
}
