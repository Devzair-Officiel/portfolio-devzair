import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type ApiProject, type ApiExperience, type ApiSkill, type ApiCategory } from '@/utils/api'

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: number
  color: string
  icon: React.ReactNode
  to: string
  warn?: boolean
}

const StatCard = ({ label, value, color, icon, to, warn }: StatCardProps) => (
  <Link
    to={to}
    className="rounded-2xl p-5 flex items-center gap-4 transition-opacity hover:opacity-80"
    style={{ background: 'var(--surface-card-solid)', border: `1px solid ${warn && value === 0 ? '#f8717144' : 'var(--border)'}` }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}18` }}
    >
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-2xl font-bold" style={{ color: warn && value === 0 ? '#f87171' : color }}>{value}</p>
      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
    {warn && value === 0 && (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    )}
  </Link>
)

// ─── Quick action ─────────────────────────────────────────────────────────────

interface QuickActionProps {
  to: string
  label: string
  color: string
  icon: React.ReactNode
}

const QuickAction = ({ to, label, color, icon }: QuickActionProps) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
    style={{ background: `${color}12`, border: `1px solid ${color}28`, color }}
  >
    {icon}
    {label}
  </Link>
)

// ─── Section status ───────────────────────────────────────────────────────────

interface SectionStatusProps {
  label: string
  count: number
  activeCount: number
  to: string
  toNew: string
}

const SectionStatus = ({ label, count, activeCount, to, toNew }: SectionStatusProps) => {
  const isEmpty = count === 0
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
      style={{
        background: isEmpty ? '#f8717108' : 'var(--surface-card-solid)',
        border: `1px solid ${isEmpty ? '#f8717133' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: isEmpty ? '#f87171' : '#22c55e' }}
        />
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</span>
        {!isEmpty && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {activeCount}/{count} visible{activeCount !== 1 ? 's' : ''}
          </span>
        )}
        {isEmpty && (
          <span className="text-xs" style={{ color: '#f87171' }}>Vide</span>
        )}
      </div>
      <Link
        to={isEmpty ? toNew : to}
        className="text-xs px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70 shrink-0"
        style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
      >
        {isEmpty ? 'Ajouter' : 'Gérer'}
      </Link>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const AdminDashboardPage = () => {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [experiences, setExperiences] = useState<ApiExperience[]>([])
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.projects.list(),
      api.experiences.list(false),
      api.skills.list(),
      api.categories.list(),
    ]).then(([p, e, s, c]) => {
      setProjects(p)
      setExperiences(e)
      setSkills(s)
      setCategories(c)
    }).finally(() => setLoading(false))
  }, [])

  const activeProjects = projects.filter(p => p.is_active).length
  const activeExperiences = experiences.filter(e => e.is_active).length

  const recentItems = [
    ...projects.slice(0, 3).map(p => ({ type: 'project' as const, id: p.id, label: p.title, sub: p.stack.slice(0, 2).join(', '), active: p.is_active })),
    ...experiences.slice(0, 3).map(e => ({ type: 'experience' as const, id: e.id, label: e.role_fr, sub: `${e.company} · ${e.period}`, active: e.is_active })),
  ].slice(0, 5)

  if (loading) {
    return <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
        <span style={{ color: 'var(--border)' }}>·</span>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Vue d'ensemble de votre portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Projets"
          value={projects.length}
          color="var(--color-brand)"
          to="/admin/projects"
          warn
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          }
        />
        <StatCard
          label="Expériences"
          value={experiences.length}
          color="#a78bfa"
          to="/admin/experiences"
          warn
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Compétences"
          value={skills.length}
          color="#34d399"
          to="/admin/skills"
          warn
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
            </svg>
          }
        />
        <StatCard
          label="Catégories"
          value={categories.length}
          color="#f59e0b"
          to="/admin/skills"
          warn
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* État du portfolio */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>État du portfolio</h2>
          <SectionStatus
            label="Projets"
            count={projects.length}
            activeCount={activeProjects}
            to="/admin/projects"
            toNew="/admin/projects/new"
          />
          <SectionStatus
            label="Expériences"
            count={experiences.length}
            activeCount={activeExperiences}
            to="/admin/experiences"
            toNew="/admin/experiences/new"
          />
          <SectionStatus
            label="Compétences"
            count={skills.length}
            activeCount={skills.length}
            to="/admin/skills"
            toNew="/admin/skills"
          />
        </div>

        {/* Activité récente */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Récemment ajoutés</h2>
          </div>
          {recentItems.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: 'var(--text-muted)' }}>Aucun contenu pour l'instant.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {recentItems.map(item => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={`/admin/${item.type === 'project' ? 'projects' : 'experiences'}/${item.id}/edit`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-opacity hover:opacity-80"
                  style={{ background: 'var(--surface-card-solid)', border: '1px solid var(--border)' }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: item.active ? '#22c55e' : 'var(--text-muted)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{item.label}</p>
                    {item.sub && (
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                    )}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: item.type === 'project' ? 'var(--color-brand-glow)' : 'rgba(167,139,250,0.12)',
                      color: item.type === 'project' ? 'var(--color-brand)' : '#a78bfa',
                    }}
                  >
                    {item.type === 'project' ? 'Projet' : 'Exp.'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Raccourcis */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            to="/admin/projects/new"
            label="Nouveau projet"
            color="var(--color-brand)"
            icon={
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          <QuickAction
            to="/admin/experiences/new"
            label="Nouvelle expérience"
            color="#a78bfa"
            icon={
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          <QuickAction
            to="/admin/skills"
            label="Gérer les compétences"
            color="#34d399"
            icon={
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
              </svg>
            }
          />
          <QuickAction
            to="/admin/content"
            label="Modifier le contenu"
            color="#f59e0b"
            icon={
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
}
