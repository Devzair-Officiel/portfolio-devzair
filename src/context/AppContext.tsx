import { createContext, useContext, type ReactNode } from 'react'
import { useTheme, useLang } from '@/hooks'
import type { Theme } from '@/hooks'

interface AppContextType {
  theme: Theme
  toggleTheme: () => void
  lang: string
  toggleLang: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme } = useTheme()
  const { lang, toggleLang } = useLang()

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext doit être utilisé dans AppProvider')
  return ctx
}
