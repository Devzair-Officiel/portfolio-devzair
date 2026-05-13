import { useState } from 'react'
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { useAppContext } from '@/context/AppContext'

const NAV_ITEMS = [
  {
    to: '/admin',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
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
    to: '/admin/experiences',
    label: 'Expériences',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/skills',
    label: 'Compétences',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
      </svg>
    ),
  },
  {
    to: '/admin/content',
    label: 'Intro',
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
]

function usePageTitle() {
  const location = useLocation()
  const match = NAV_ITEMS.find(item =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )
  return match?.label ?? 'Admin'
}

// ─── Theme toggle button ──────────────────────────────────────────────────────

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAppContext()
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors hover:opacity-70"
      style={{ color: 'var(--text-muted)', background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    >
      {theme === 'dark' ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const { logout } = useAuthContext()
  const location = useLocation()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', height: '57px', minHeight: '57px' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: 'linear-gradient(135deg, #7c6fff, #a78bfa)', color: '#fff' }}
          >
            dZ
          </div>
          <div>
            <p className="text-sm font-bold leading-none" style={{ color: 'var(--text)' }}>devZair</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Admin</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 px-3 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
          Navigation
        </p>
        {NAV_ITEMS.map(item => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? 'var(--color-brand-glow)' : 'transparent',
                color: active ? 'var(--color-brand)' : 'var(--text-muted)',
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: 'var(--color-brand)' }}
                />
              )}
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 hover:opacity-80 mb-1"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Voir le portfolio
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all duration-150 hover:opacity-80"
          style={{ color: '#f87171' }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export const AdminLayout = () => {
  const { isAuthenticated } = useAuthContext()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const pageTitle = usePageTitle()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface)' }}>

      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex w-60 flex-col fixed h-full z-30"
        style={{ background: 'var(--surface-alt)', borderRight: '1px solid var(--border)' }}
      >
        <SidebarContent />
      </aside>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: '#00000066' }}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-xs z-50 md:hidden transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--surface-alt)', borderRight: '1px solid var(--border)' }}
      >
        <SidebarContent onClose={() => setMenuOpen(false)} />
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-60 min-h-screen flex flex-col min-w-0">

        {/* Topbar */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6 md:px-8"
          style={{
            height: '57px',
            background: 'var(--surface-alt)',
            borderBottom: '1px solid var(--border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Left: burger (mobile) + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 rounded-xl hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-xs" style={{ color: 'var(--text-muted)' }}>Admin</span>
              <span className="hidden md:inline text-xs" style={{ color: 'var(--border)' }}>›</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{pageTitle}</span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Portfolio
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
