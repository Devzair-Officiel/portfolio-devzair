import { createContext, useContext, useState, type ReactNode } from 'react'

const TOKEN_KEY = 'admin_token'
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))

  const login = async (username: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Identifiants incorrects')
    const data = (await res.json()) as { access_token: string }
    localStorage.setItem(TOKEN_KEY, data.access_token)
    setToken(data.access_token)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: token !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
