import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'

const NAV_LINKS = [
  { key: 'skills',     href: '#skills',     label_fr: 'Compétences', label_en: 'Skills'     },
  { key: 'projects',   href: '#projects',   label_fr: 'Projets',     label_en: 'Projects'   },
  { key: 'experience', href: '#experience', label_fr: 'Expérience',  label_en: 'Experience' },
  { key: 'contact',    href: '#contact',    label_fr: 'Contact',     label_en: 'Contact'    },
] as const

export const Navbar = () => {
  const { t } = useTranslation()
  const { theme, toggleTheme, toggleLang, lang } = useAppContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'color-mix(in srgb, var(--bg) 85%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <a
          href="#hero"
          aria-label="devZair"
          className="flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px' }}
        >
          <span className="grad-text">devZair</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm transition-all duration-150"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-muted)',
                fontWeight: 400,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.backgroundColor = 'var(--acc-dim)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {lang === 'fr' ? link.label_fr : link.label_en}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-mid)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--acc)'
              e.currentTarget.style.borderColor = 'var(--border-acc)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border-mid)'
            }}
            aria-label={t('nav.lang_switch')}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-mid)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--acc)'
              e.currentTarget.style.borderColor = 'var(--border-acc)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border-mid)'
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
            className="md:hidden p-2 rounded-lg cursor-pointer"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-mid)' }}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="md:hidden flex flex-col px-6 pb-5 gap-1"
          style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-raised)' }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="py-3 text-sm transition-colors duration-150"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--acc)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {lang === 'fr' ? link.label_fr : link.label_en}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
