import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

const ACCESS_KEY = 'admin_token'
const REFRESH_KEY = 'admin_refresh_token'
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface AuthContextType {
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ACCESS_KEY))
  const refreshingRef = useRef<Promise<string | null> | null>(null)

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    setToken(null)
  }, [])

  const doRefresh = useCallback((): Promise<string | null> => {
    if (refreshingRef.current) return refreshingRef.current

    const refreshToken = localStorage.getItem(REFRESH_KEY)
    if (!refreshToken) {
      logout()
      return Promise.resolve(null)
    }

    refreshingRef.current = fetch(`${API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Refresh failed')
        return res.json() as Promise<{ access_token: string }>
      })
      .then(data => {
        localStorage.setItem(ACCESS_KEY, data.access_token)
        setToken(data.access_token)
        return data.access_token
      })
      .catch(() => {
        logout()
        return null
      })
      .finally(() => {
        refreshingRef.current = null
      })

    return refreshingRef.current
  }, [logout])

  const authFetch = useCallback(
    async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
      const currentToken = localStorage.getItem(ACCESS_KEY)
      const headers = new Headers(init?.headers)
      if (currentToken) headers.set('Authorization', `Bearer ${currentToken}`)

      const res = await fetch(input, { ...init, headers })

      if (res.status === 401) {
        const newToken = await doRefresh()
        if (!newToken) return res

        const retryHeaders = new Headers(init?.headers)
        retryHeaders.set('Authorization', `Bearer ${newToken}`)
        return fetch(input, { ...init, headers: retryHeaders })
      }

      return res
    },
    [doRefresh],
  )

  const login = async (username: string, password: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Identifiants incorrects')
    const data = (await res.json()) as { access_token: string; refresh_token: string }
    localStorage.setItem(ACCESS_KEY, data.access_token)
    localStorage.setItem(REFRESH_KEY, data.refresh_token)
    setToken(data.access_token)
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: token !== null, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
