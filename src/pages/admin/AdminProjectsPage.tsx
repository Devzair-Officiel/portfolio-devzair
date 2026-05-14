import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { api, type ApiProject } from '@/utils/api'
import { SkeletonCard } from '@/components/admin/Skeleton'

const DragHandle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </svg>
)

export const AdminProjectsPage = () => {
  const { authFetch } = useAuthContext()
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const dragIndex = useRef<number | null>(null)

  const load = () => {
    setLoading(true)
    api.projects
      .list()
      .then(data => setProjects([...data].sort((a, b) => a.order - b.order)))
      .catch(() => setError('Impossible de charger les projets'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Supprimer "${title}" définitivement ?`)) return
    try {
      await api.projects.delete(authFetch, id)
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const handleToggleActive = async (project: ApiProject) => {
    try {
      const updated = await api.projects.update(authFetch, project.id, { is_active: !project.is_active })
      setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)))
    } catch {
      alert('Erreur lors de la mise à jour')
    }
  }

  const handleDragStart = (index: number) => {
    dragIndex.current = index
  }

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex.current === null || dragIndex.current === dropIndex) return
    const reordered = [...projects]
    const [moved] = reordered.splice(dragIndex.current, 1)
    reordered.splice(dropIndex, 0, moved)
    dragIndex.current = null
    setProjects(reordered)
    setSaving(true)
    try {
      await api.projects.reorder(authFetch, reordered.map(p => p.id))
    } catch {
      alert('Erreur lors de la sauvegarde de l\'ordre')
      load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Projets</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {projects.length} projet{projects.length !== 1 ? 's' : ''}
            {saving && <span className="ml-2" style={{ color: 'var(--color-brand)' }}>Sauvegarde…</span>}
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ background: 'var(--color-brand)', color: '#fff' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau projet
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}
      {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}

      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <div
              className="py-16 text-center rounded-2xl"
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              Aucun projet. <Link to="/admin/projects/new" style={{ color: 'var(--color-brand)' }}>Créez-en un →</Link>
            </div>
          ) : (
            <>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Glissez-déposez les lignes pour changer l'ordre d'affichage.
              </p>

              {/* Vue mobile — cartes */}
              <div className="flex flex-col gap-3 md:hidden">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className="p-4 rounded-2xl flex flex-col gap-3 cursor-grab active:cursor-grabbing"
                    style={{ background: 'var(--surface-card-solid)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}><DragHandle /></span>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{project.title}</p>
                          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleActive(project)}
                        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 transition-opacity hover:opacity-70"
                        style={{
                          background: project.is_active ? '#22c55e22' : 'var(--surface-alt)',
                          color: project.is_active ? '#22c55e' : 'var(--text-muted)',
                          border: `1px solid ${project.is_active ? '#22c55e44' : 'var(--border)'}`,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.is_active ? '#22c55e' : 'var(--text-muted)' }} />
                        {project.is_active ? 'Visible' : 'Masqué'}
                      </button>
                    </div>

                    {project.stack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.stack.slice(0, 4).map(tech => (
                          <span key={tech} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}>
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 4 && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+{project.stack.length - 4}</span>}
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70"
                        style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
                      >
                        Éditer
                      </Link>
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer"
                          className="text-xs px-2 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          GitHub
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer"
                          className="text-xs px-2 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          Live
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70 ml-auto"
                        style={{ border: '1px solid var(--border)', color: '#f87171' }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vue desktop — table */}
              <div
                className="hidden md:block rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-card-solid)' }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['', 'Statut', 'Titre', 'Stack', 'Liens', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left font-medium" style={{ color: 'var(--text-muted)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, i) => (
                      <tr
                        key={project.id}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => handleDrop(i)}
                        className="transition-colors duration-100 cursor-grab active:cursor-grabbing"
                        style={{ borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-alt)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td className="px-3 py-4" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
                          <DragHandle />
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleActive(project)}
                            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-70"
                            style={{
                              background: project.is_active ? '#22c55e22' : 'var(--surface-alt)',
                              color: project.is_active ? '#22c55e' : 'var(--text-muted)',
                              border: `1px solid ${project.is_active ? '#22c55e44' : 'var(--border)'}`,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.is_active ? '#22c55e' : 'var(--text-muted)' }} />
                            {project.is_active ? 'Visible' : 'Masqué'}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold" style={{ color: 'var(--text)' }}>{project.title}</span>
                          <p className="text-xs mt-0.5 max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1 max-w-50">
                            {project.stack.slice(0, 4).map(tech => (
                              <span key={tech} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}>
                                {tech}
                              </span>
                            ))}
                            {project.stack.length > 4 && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+{project.stack.length - 4}</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            {project.github_url && (
                              <a href={project.github_url} target="_blank" rel="noreferrer"
                                className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
                                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                GitHub
                              </a>
                            )}
                            {project.live_url && (
                              <a href={project.live_url} target="_blank" rel="noreferrer"
                                className="text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
                                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                Live
                              </a>
                            )}
                            {!project.github_url && !project.live_url && <span style={{ color: 'var(--text-muted)' }}>—</span>}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/projects/${project.id}/edit`}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70"
                              style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
                            >
                              Éditer
                            </Link>
                            <button
                              onClick={() => handleDelete(project.id, project.title)}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70"
                              style={{ border: '1px solid var(--border)', color: '#f87171' }}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
