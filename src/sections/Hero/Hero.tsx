import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { api } from '@/utils/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

const ScrambleTitle = ({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
}) => {
  const [chars, setChars] = useState<string[]>(() =>
    text.split('').map(c => (c === ' ' ? ' ' : CHARSET[Math.floor(Math.random() * CHARSET.length)]))
  )

  useEffect(() => {
    let revealed = 0
    let tick = 0
    let rafId: number

    const animate = () => {
      tick++
      if (tick % 4 === 0 && revealed < text.length) revealed++

      setChars(
        text.split('').map((c, i) => {
          if (c === ' ') return ' '
          if (i < revealed) return c
          return CHARSET[Math.floor(Math.random() * CHARSET.length)]
        })
      )

      if (revealed < text.length) {
        rafId = requestAnimationFrame(animate)
      } else {
        setChars(text.split(''))
      }
    }

    const timeout = setTimeout(() => {
      rafId = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId)
    }
  }, [text, delay])

  return (
    <motion.span
      className={className}
      style={{ display: 'block', ...style }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {chars.join('')}
    </motion.span>
  )
}

export const Hero = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({})
  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 600], [0, -80])
  const opacityFade = useTransform(scrollY, [0, 400], [1, 0])

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
  const logoSrc     = settingsMap['logo_url'] ? `${API_URL}${settingsMap['logo_url']}` : '/devzair-sm.webp'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-6 sm:gap-10"
        style={{ y: yParallax, opacity: opacityFade }}
      >
        {/* Logo + label */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div style={{ position: 'relative', padding: '2px', borderRadius: '14px', display: 'inline-flex', overflow: 'hidden' }}>
            <motion.div
              style={{
                position: 'absolute', inset: 0, borderRadius: '14px',
                background: 'conic-gradient(from 0deg, #8b5cf6, #06b6d4, #f43f5e, #8b5cf6)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <img
              src={logoSrc}
              alt="devZair logo"
              width={40}
              height={40}
              fetchPriority="high"
              decoding="sync"
              style={{ position: 'relative', borderRadius: '12px', display: 'block' }}
            />
          </div>
          <span className="section-label">devZair · Full Stack Dev</span>
        </motion.div>

        {/* Titre massif */}
        <div className="flex flex-col gap-2">
          <h1
            className="font-bold leading-[0.95] tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem,10vw,8rem)' }}
          >
            <ScrambleTitle text="Aurélien" className="gradient-text-alt" delay={0.2} />
            <ScrambleTitle
              text="Boudon"
              className="gradient-text"
              style={{ marginTop: '0.05em' }}
              delay={0.5}
            />
          </h1>
        </div>

        {/* Sous-titre */}
        <motion.p
          className="max-w-xl text-base sm:text-lg leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
        >
          {heroTitle}
        </motion.p>

        {/* Tagline badge */}
        <motion.div
          className="px-5 py-2.5 rounded-full text-sm font-medium"
          style={{
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.25)',
            color: '#c4b5fd',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          ✦ {heroTagline}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gradient px-7 py-3.5 text-sm"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.755-1.755-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {t('hero.cta_github')}
            </span>
          </a>

          <a
            href="#contact"
            className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              border: '1px solid var(--border-bright)',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-bright)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {t('hero.cta_contact')}
          </a>

          <a
            href={`/cv-${lang}.pdf`}
            download
            className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              border: '1px solid var(--border-bright)',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-bright)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-3-3m3 3l3-3M4 20h16" />
              </svg>
              {lang === 'fr' ? 'Télécharger mon CV' : 'Download my CV'}
            </span>
          </a>

          <a
            href={`/cv-${lang}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              border: '1px solid var(--border-bright)',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-bright)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {lang === 'fr' ? 'Visionner mon CV' : 'View my CV'}
            </span>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex gap-5 sm:gap-8 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          {[
            { value: '5+', label: lang === 'en' ? "Years exp." : "Ans d'exp." },
            { value: '15+', label: lang === 'en' ? 'Projects' : 'Projets' },
            { value: '100%', label: 'Passion' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg,#a78bfa,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {stat.value}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

    </section>
  )
}
