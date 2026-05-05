import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { api, type ProjectPayload } from '@/utils/api'
import { TagInput } from '@/components/admin/TagInput'

export const AdminProjectFormPage = () => {
  const { id } = useParams()
  const isEdit = id !== undefined
  const { authFetch } = useAuthContext()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stack, setStack] = useState<string[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetchingProject, setFetchingProject] = useState(isEdit)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    if (!isEdit) return
    api.projects
      .list()
      .then(projects => {
        const project = projects.find(p => p.id === Number(id))
        if (!project) return
        setTitle(project.title)
        setDescription(project.description)
        setStack(project.stack)
        setGithubUrl(project.github_url ?? '')
        setLiveUrl(project.live_url ?? '')
        setIsActive(project.is_active)
      })
      .finally(() => setFetchingProject(false))
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const payload: ProjectPayload = {
      title,
      description,
      stack,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      is_active: isActive,
    }
    try {
      if (isEdit) {
        await api.projects.update(authFetch, Number(id), payload)
      } else {
        await api.projects.create(authFetch, payload)
      }
      navigate('/admin/projects')
    } catch {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'px-4 py-2.5 rounded-xl outline-none w-full text-sm transition-colors'
  const inputStyle = {
    background: 'var(--surface-alt)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }
  const labelStyle = { color: 'var(--text-muted)' }

  if (fetchingProject) {
    return <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/projects')}
          className="flex items-center gap-1.5 text-sm mb-4 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {isEdit ? 'Éditer le projet' : 'Nouveau projet'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: '#f8717122', color: '#f87171', border: '1px solid #f8717144' }}
          >
            {error}
          </div>
        )}

        {/* Titre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
            Titre *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={inputClass}
            style={inputStyle}
            placeholder="Nom du projet"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
            Description *
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className={`${inputClass} resize-none`}
            style={inputStyle}
            placeholder="Décrivez le projet en quelques phrases…"
            required
          />
        </div>

        {/* Stack */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
            Stack
          </label>
          <TagInput tags={stack} onChange={setStack} />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Tapez une techno puis appuyez sur <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}>Entrée</kbd> pour l'ajouter. Cliquez sur un tag pour le supprimer.
          </p>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
              URL GitHub
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://github.com/…"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
              URL Live
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={e => setLiveUrl(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="https://monprojet.fr"
            />
          </div>
        </div>

        {/* Visibilité */}
        <label
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-10 h-6 rounded-full transition-colors"
              style={{ background: isActive ? 'var(--color-brand)' : 'var(--border)' }}
            />
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ left: isActive ? '22px' : '4px' }}
            />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              Visible sur le portfolio
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isActive ? 'Affiché publiquement' : 'Masqué du portfolio'}
            </p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-brand)', color: '#fff' }}
          >
            {loading ? 'Sauvegarde…' : isEdit ? 'Enregistrer les modifications' : 'Créer le projet'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-70"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
