import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { api, type ProjectPayload } from '@/utils/api'
import { TagInput } from '@/components/admin/TagInput'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const AdminProjectFormPage = () => {
  const { id } = useParams()
  const isEdit = id !== undefined
  const { authFetch } = useAuthContext()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stack, setStack] = useState<string[]>([])
  const [githubUrl, setGithubUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
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
        setImageUrl(project.image_url ?? '')
        setIsActive(project.is_active)
      })
      .finally(() => setFetchingProject(false))
  }, [id, isEdit])

  const handleImageUpload = async (file: File) => {
    if (!authFetch) return
    setImageUploading(true)
    setImageError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await authFetch(`${API_URL}/api/v1/upload/image`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { detail?: string }
        throw new Error(body.detail ?? `Erreur HTTP ${res.status}`)
      }
      const data = await res.json() as { url: string }
      setImageUrl(`${API_URL}${data.url}`)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setImageUploading(false)
    }
  }

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
      image_url: imageUrl || null,
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
  const inputStyle = { background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text)' }
  const labelStyle = { color: 'var(--text-muted)' }

  if (fetchingProject) return <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>

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
          <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#f8717122', color: '#f87171', border: '1px solid #f8717144' }}>
            {error}
          </div>
        )}

        {/* Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
            Image du projet <span style={{ textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>(optionnel)</span>
          </label>

          {imageUrl ? (
            <div className="relative rounded-xl overflow-hidden group" style={{ height: '180px' }}>
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(0,0,0,0.5)' }}>
                <label
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Changer
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    disabled={imageUploading}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ background: 'rgba(248,113,113,0.3)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.4)' }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              </div>
              {imageUploading && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <span className="text-xs text-white font-medium">Upload en cours…</span>
                </div>
              )}
            </div>
          ) : (
            <label
              className="relative flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                height: '140px',
                border: `2px dashed ${imageUploading ? 'var(--color-brand)' : 'var(--border)'}`,
                background: imageUploading ? 'var(--color-brand-glow)' : 'var(--surface-alt)',
              }}
            >
              {imageUploading ? (
                <p className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>Upload en cours…</p>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-brand-glow)' }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-brand)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Cliquez pour uploader une image</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PNG, JPEG, WEBP — max 2 Mo</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                disabled={imageUploading}
              />
            </label>
          )}

          {imageError && (
            <p className="text-xs" style={{ color: '#f87171' }}>{imageError}</p>
          )}
        </div>

        {/* Titre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>Titre *</label>
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
          <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>Description *</label>
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
          <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>Stack</label>
          <TagInput tags={stack} onChange={setStack} />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Tapez une techno puis <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}>Entrée</kbd> pour l'ajouter.
          </p>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>URL GitHub</label>
            <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} className={inputClass} style={inputStyle} placeholder="https://github.com/…" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>URL Live</label>
            <input type="url" value={liveUrl} onChange={e => setLiveUrl(e.target.value)} className={inputClass} style={inputStyle} placeholder="https://monprojet.fr" />
          </div>
        </div>

        {/* Visibilité */}
        <label
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <div className="relative shrink-0">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
            <div className="w-10 h-6 rounded-full transition-colors" style={{ background: isActive ? 'var(--color-brand)' : 'var(--border)' }} />
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: isActive ? '22px' : '4px' }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Visible sur le portfolio</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{isActive ? 'Affiché publiquement' : 'Masqué du portfolio'}</p>
          </div>
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || imageUploading}
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
