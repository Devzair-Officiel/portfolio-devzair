import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { ProjectType } from '@/types'

interface Props {
  project: ProjectType
  accentColor?: string
  index: number
}

export const ProjectCard = ({ project, accentColor = '#8b5cf6', index }: Props) => {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      className="flex flex-col overflow-hidden h-full rounded-[18px] cursor-default"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered ? `${accentColor}45` : 'var(--border)'}`,
        boxShadow: hovered ? `0 16px 48px ${accentColor}18` : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      animate={{ y: hovered ? -5 : 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Header */}
      <div className="relative h-44 overflow-hidden shrink-0">
        {project.imageUrl ? (
          <>
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 45%, var(--surface) 100%)' }}
            />
          </>
        ) : (
          <div
            className="w-full h-full relative flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}1a 0%, ${accentColor}06 100%)` }}
          >
            {/* Top line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}90, transparent)` }}
            />
            {/* Orb top-left */}
            <div
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentColor}22, transparent 65%)` }}
            />
            {/* Orb bottom-right */}
            <div
              className="absolute -bottom-6 right-1/3 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${accentColor}15, transparent 65%)` }}
            />
            {/* Big number in background */}
            <span
              className="absolute right-4 -bottom-2 font-black leading-none select-none pointer-events-none"
              style={{
                fontSize: '8rem',
                color: accentColor,
                opacity: 0.07,
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
              }}
            >
              {num}
            </span>
            {/* Center badge */}
            <span
              className="relative z-10 text-sm font-bold tracking-widest px-4 py-2 rounded-full"
              style={{
                background: `${accentColor}14`,
                border: `1px solid ${accentColor}35`,
                color: accentColor,
                fontFamily: 'var(--font-display)',
              }}
            >
              {num}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3
          className="text-base font-bold leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed flex-1 line-clamp-3"
          style={{ color: 'var(--text-muted)' }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map(tech => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: `${accentColor}12`,
                border: `1px solid ${accentColor}28`,
                color: accentColor,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div
          className="flex items-center gap-3 pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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
              className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{
                background: `${accentColor}14`,
                border: `1px solid ${accentColor}35`,
                color: accentColor,
              }}
            >
              {t('projects.live')}
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15M4.5 4.5h15v15" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
