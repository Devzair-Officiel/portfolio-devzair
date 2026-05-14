import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'

const NAV_LINKS = [
  { key: 'skills',     href: '#skills' },
  { key: 'projects',   href: '#projects' },
  { key: 'experience', href: '#experience' },
  { key: 'contact',    href: '#contact' },
] as const

export const Navbar = () => {
  const { t } = useTranslation()
  const { theme, toggleTheme, toggleLang, lang } = useAppContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(5,5,8,0.15)' : 'rgba(5,5,8,0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <a href="#hero" aria-label="devZair" className="flex items-center gap-2.5 group">
          <img
            src="/devzair-sm.webp"
            alt="devZair"
            width={32}
            height={32}
            className="rounded-lg transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(139,92,246,0.6)]"
          />
          <span
            className="text-sm font-semibold hidden sm:block"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
          >
            devZair
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium transition-all duration-200 relative group"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {t(`nav.${link.key}`)}
              <span
                className="absolute -bottom-0.5 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}
              />
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text)'
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
            aria-label={t('nav.lang_switch')}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text)'
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
            aria-label={theme === 'dark' ? t('nav.theme_dark') : t('nav.theme_light')}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="md:hidden flex flex-col px-6 pb-4 gap-1"
          style={{ borderTop: '1px solid var(--border)', background: 'rgba(5,5,8,0.95)' }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium py-3 transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
