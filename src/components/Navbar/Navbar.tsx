import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'

export const Navbar = () => {
  const { t } = useTranslation()
  const { theme, toggleTheme, toggleLang, lang } = useAppContext()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--surface) 70%, transparent)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span className="text-brand font-extrabold tracking-widest text-sm uppercase">
        devZair
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer hover:text-brand"
          style={{ color: 'var(--text-muted)' }}
          aria-label={t('nav.lang_switch')}
        >
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border)' }} />

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all duration-200 cursor-pointer hover:text-brand"
          style={{ color: 'var(--text-muted)' }}
          aria-label={theme === 'dark' ? t('nav.theme_dark') : t('nav.theme_light')}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
