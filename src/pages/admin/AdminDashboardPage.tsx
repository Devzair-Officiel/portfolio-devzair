import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type ApiProject } from '@/utils/api'

interface StatCardProps {
  label: string
  value: number
  color: string
}

const StatCard = ({ label, value, color }: StatCardProps) => (
  <div
    className="rounded-2xl p-6 flex flex-col gap-2"
    style={{ background: 'var(--surface-card-solid)', border: '1px solid var(--border)' }}
  >
    <span className="text-3xl font-bold" style={{ color }}>
      {value}
    </span>
    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
      {label}
    </span>
  </div>
)

export const AdminDashboardPage = () => {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.projects
      .list()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  const total = projects.length
  const active = projects.filter(p => p.is_active).length
  const hidden = total - active

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Vue d'ensemble de votre portfolio
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Projets total" value={total} color="var(--color-brand)" />
          <StatCard label="Visibles" value={active} color="#22c55e" />
          <StatCard label="Masqués" value={hidden} color="var(--text-muted)" />
        </div>
      )}

      {/* Projets récents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: 'var(--text)' }}>
            Projets récents
          </h2>
          <Link
            to="/admin/projects"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--color-brand)' }}
          >
            Voir tout →
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {projects.slice(0, 5).map(project => (
            <div
              key={project.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface-card-solid)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: project.is_active ? '#22c55e' : 'var(--text-muted)' }}
                />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {project.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {project.stack.slice(0, 3).join(', ')}
                </span>
                <Link
                  to={`/admin/projects/${project.id}/edit`}
                  className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
                  style={{ color: 'var(--color-brand)', background: 'var(--color-brand-glow)' }}
                >
                  Éditer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action rapide */}
      <Link
        to="/admin/projects/new"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm w-fit transition-opacity hover:opacity-80"
        style={{ background: 'var(--color-brand)', color: '#fff' }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un projet
      </Link>
    </div>
  )
}
