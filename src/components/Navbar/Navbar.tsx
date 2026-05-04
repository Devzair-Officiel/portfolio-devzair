import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'

const NAV_LINKS = [
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'experience', href: '#experience' },
  { key: 'contact', href: '#contact' },
] as const

export const Navbar = () => {
  const { t } = useTranslation()
  const { theme, toggleTheme, toggleLang, lang } = useAppContext()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'var(--surface-card)',
        backdropFilter: 'var(--glass)',
        WebkitBackdropFilter: 'var(--glass)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <a href="#hero" aria-label="devZair — retour en haut">
          <img
            src="/devzair.png"
            alt="devZair"
            width={36}
            height={36}
            className="rounded-lg"
            style={{ boxShadow: 'var(--logo-shadow)' }}
          />
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {t(`${link.key}.title`)}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            aria-label={t('nav.lang_switch')}
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>

          <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border)' }} />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            aria-label={theme === 'dark' ? t('nav.theme_dark') : t('nav.theme_light')}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* Burger mobile */}
          <button
            className="md:hidden p-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav
          className="md:hidden flex flex-col px-6 pb-4 gap-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium py-2.5 transition-colors duration-200"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {t(`${link.key}.title`)}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
