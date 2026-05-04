import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'

export const AdminLoginPage = () => {
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin/projects')
    } catch {
      setError('Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--surface)' }}
    >
      {/* Glow décoratif */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'var(--color-brand-glow)', opacity: 0.4 }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm flex flex-col gap-5 p-8 rounded-2xl"
        style={{
          background: 'var(--surface-card-solid)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--glow-sm)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-2">
          <span className="text-2xl font-bold" style={{ color: 'var(--color-brand)' }}>
            devZair
          </span>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Interface d'administration
          </p>
        </div>

        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm text-center"
            style={{ background: '#f8717122', color: '#f87171', border: '1px solid #f8717144' }}
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-2.5 rounded-xl outline-none text-sm"
            style={inputStyle}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2.5 rounded-xl outline-none text-sm"
            style={inputStyle}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-2.5 rounded-xl font-semibold text-sm mt-1 disabled:opacity-50 transition-opacity hover:opacity-80"
          style={{ background: 'var(--color-brand)', color: '#fff' }}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
