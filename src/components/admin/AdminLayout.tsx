import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'

const navItems = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    exact: true,
  },
  {
    to: '/admin/projects',
    label: 'Projets',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    ),
  },
  {
    to: '/admin/content',
    label: 'Contenu',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
]

export const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuthContext()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface)' }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex flex-col py-6 px-4 gap-2 fixed h-full"
        style={{
          background: 'var(--surface-alt)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="px-3 mb-6">
          <span className="text-lg font-bold" style={{ color: 'var(--color-brand)' }}>
            devZair
          </span>
          <span
            className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
          >
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? 'var(--color-brand-glow)' : 'transparent',
                  color: active ? 'var(--color-brand)' : 'var(--text-muted)',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voir le site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm w-full text-left transition-all hover:opacity-80"
            style={{ color: 'var(--text-muted)' }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 p-8 min-h-screen" style={{ background: 'var(--surface)' }}>
        <Outlet />
      </main>
    </div>
  )
}
