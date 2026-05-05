import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fadeUp, staggerContainer } from '@/utils/animations'
import { api } from '@/utils/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const Hero = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({})

  useEffect(() => {
    api.settings.list().then(settings => {
      const map: Record<string, string> = {}
      settings.forEach(s => { map[s.key] = s.value })
      setSettingsMap(map)
    }).catch(() => {})
  }, [])

  const heroTitle = settingsMap[`hero_title_${lang}`] ?? null
  const heroTagline = settingsMap[`hero_tagline_${lang}`] ?? null
  const githubUrl = settingsMap['github_url'] || 'https://github.com/devzair-officiel'
  const logoSrc = settingsMap['logo_url'] ? `${API_URL}${settingsMap['logo_url']}` : '/devzair.png'

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <motion.div
        className="flex flex-col items-center gap-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <img
            src={logoSrc}
            alt="devZair logo"
            width={96}
            height={96}
            className="rounded-2xl"
            style={{ boxShadow: 'var(--logo-shadow)' }}
          />
        </motion.div>

        <motion.div className="flex flex-col gap-3" variants={fadeUp}>
          <p className="text-sm font-semibold tracking-[0.3em] uppercase" style={{ color: 'var(--text-muted)' }}>
            devZair
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
            style={{
              background: 'var(--hero-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('hero.name')}
          </h1>
          <h2
            className="text-lg sm:text-xl font-medium tracking-wide"
            style={{ color: 'var(--text-muted)' }}
          >
            {heroTitle ?? t('hero.title')}
          </h2>
        </motion.div>

        <motion.p
          className="max-w-lg text-base sm:text-lg leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
          variants={fadeUp}
        >
          {heroTagline ?? t('hero.tagline')}
        </motion.p>

        <motion.div className="flex flex-wrap gap-4 justify-center" variants={fadeUp}>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-brand text-white font-semibold text-sm tracking-wide transition-all duration-200"
            style={{ boxShadow: 'var(--glow-md)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 32px #7c6fff66')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--glow-md)')}
          >
            {t('hero.cta_github')}
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200"
            style={{
              border: '1px solid var(--border-hover)',
              color: 'var(--text)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--glow-sm)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            {t('hero.cta_contact')}
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#skills"
        aria-label={t('hero.scroll_label')}
        className="absolute bottom-8 transition-colors duration-200"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.6 } }}
        onMouseEnter={e => (e.currentTarget.style.color = '#7c6fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.a>
    </section>
  )
}
