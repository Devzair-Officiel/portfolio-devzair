import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { api, type ApiExperience } from '@/utils/api'
import { SkeletonCard } from '@/components/admin/Skeleton'

export const AdminExperiencesPage = () => {
  const { authFetch } = useAuthContext()
  const [experiences, setExperiences] = useState<ApiExperience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.experiences.list(false).then(setExperiences).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number, role: string) => {
    if (!confirm(`Supprimer "${role}" définitivement ?`)) return
    await api.experiences.delete(authFetch, id)
    setExperiences(prev => prev.filter(e => e.id !== id))
  }

  const handleToggle = async (exp: ApiExperience) => {
    const updated = await api.experiences.update(authFetch, exp.id, { is_active: !exp.is_active })
    setExperiences(prev => prev.map(e => e.id === updated.id ? updated : e))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Expériences</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {experiences.length} expérience{experiences.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/admin/experiences/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ background: 'var(--color-brand)', color: '#fff' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle expérience
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-4">
          {experiences.length === 0 && (
            <div className="py-16 text-center rounded-2xl" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              Aucune expérience. <Link to="/admin/experiences/new" style={{ color: 'var(--color-brand)' }}>Créez-en une →</Link>
            </div>
          )}
          {experiences.map(exp => (
            <div
              key={exp.id}
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
            >
              {/* Timeline dot */}
              <div
                className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7c6fff, #a78bfa)' }}
              >
                <div className="w-2 h-2 rounded-full bg-white opacity-80" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{exp.role_fr}</p>
                    {exp.role_en && exp.role_en !== exp.role_fr && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{exp.role_en}</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {exp.company} · {exp.period}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: exp.is_active ? '#22c55e22' : 'var(--surface)',
                      color: exp.is_active ? '#22c55e' : 'var(--text-muted)',
                      border: `1px solid ${exp.is_active ? '#22c55e44' : 'var(--border)'}`,
                    }}
                  >
                    {exp.is_active ? 'Visible' : 'Masqué'}
                  </span>
                </div>

                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  {exp.description_fr.length} point{exp.description_fr.length !== 1 ? 's' : ''} FR
                  {exp.description_en.length > 0 && ` · ${exp.description_en.length} EN`}
                </p>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => handleToggle(exp)}
                    className="text-xs px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >
                    {exp.is_active ? 'Masquer' : 'Afficher'}
                  </button>
                  <Link
                    to={`/admin/experiences/${exp.id}/edit`}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70"
                    style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
                  >
                    Éditer
                  </Link>
                  <button
                    onClick={() => handleDelete(exp.id, exp.role_fr)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70"
                    style={{ border: '1px solid var(--border)', color: '#f87171' }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
