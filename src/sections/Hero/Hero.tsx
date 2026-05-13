import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { api } from '@/utils/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// Reveal mot par mot avec masque overflow hidden
const WordReveal = ({ text, delay = 0, className = '', style = {} }: {
  text: string
  delay?: number
  className?: string
  style?: React.CSSProperties
}) => (
  <span className={className} style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em', ...style }}>
    {text.split(' ').map((word, i) => (
      <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
        <motion.span
          style={{ display: 'inline-block' }}
          initial={{ y: '110%', rotate: 3 }}
          animate={{ y: '0%', rotate: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.06 }}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </span>
)

export const Hero = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 500], [0, -80])

  useEffect(() => {
    api.settings.list().then(settings => {
      const map: Record<string, string> = {}
      settings.forEach(s => { map[s.key] = s.value })
      setSettingsMap(map)
    }).catch(() => {})
  }, [])

  const heroTitle   = settingsMap[`hero_title_${lang}`]   ?? t('hero.title')
  const heroTagline = settingsMap[`hero_tagline_${lang}`] ?? t('hero.tagline')
  const githubUrl   = settingsMap['github_url'] || 'https://github.com/devzair-officiel'

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center px-6 py-24 max-w-5xl mx-auto overflow-hidden"
    >
      <motion.div style={{ y: yParallax }} className="flex flex-col gap-8">

        {/* Badge disponibilité */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <span className="pill">
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 6px #4ade80',
                flexShrink: 0,
              }}
            />
            {lang === 'fr' ? 'Disponible pour de nouvelles missions' : 'Available for new opportunities'}
          </span>
        </motion.div>

        {/* Nom — grande typo fluide */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 9vw, 7.5rem)',
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
            }}
          >
            <WordReveal text="Aurélien" delay={0.1} />
            <br />
            <WordReveal
              text="Boudon"
              delay={0.2}
              style={{ display: 'inline-flex' }}
            />
            <motion.span
              className="grad-text"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 9vw, 7.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginLeft: '0.25em',
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              .
            </motion.span>
          </h1>
        </div>

        {/* Titre de poste */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '520px',
            lineHeight: 1.7,
          }}
        >
          <span
            className="grad-text"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            {heroTitle}
          </span>
          {' — '}
          {heroTagline}
        </motion.p>

        {/* Stack chips */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {['React', 'TypeScript', 'Python', 'Docker'].map((tech, i) => (
            <motion.span
              key={tech}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
              whileHover={{ borderColor: 'var(--border-acc)', color: 'var(--acc)', y: -2 }}
              transition={{ duration: 0.15 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-3 pt-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.755-1.755-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </motion.a>
          <motion.a
            href="#contact"
            className="btn-outline"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('hero.cta_contact')}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <motion.div
          style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, transparent, var(--acc))',
            borderRadius: '1px',
          }}
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
