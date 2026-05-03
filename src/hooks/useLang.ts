import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'dz-lang'

export const useLang = () => {
  const { i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'fr' ? 'en' : 'fr'
    i18n.changeLanguage(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { lang: i18n.language, toggleLang }
}
