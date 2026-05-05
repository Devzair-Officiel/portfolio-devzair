import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import { api, type ExperiencePayload } from '@/utils/api'
import { TagInput } from '@/components/admin/TagInput'

export const AdminExperienceFormPage = () => {
  const { id } = useParams()
  const isEdit = id !== undefined
  const { authFetch } = useAuthContext()
  const navigate = useNavigate()

  const [roleFr, setRoleFr] = useState('')
  const [roleEn, setRoleEn] = useState('')
  const [company, setCompany] = useState('')
  const [period, setPeriod] = useState('')
  const [descFr, setDescFr] = useState<string[]>([])
  const [descEn, setDescEn] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit) return
    api.experiences.list(false)
      .then(exps => {
        const exp = exps.find(e => e.id === Number(id))
        if (!exp) return
        setRoleFr(exp.role_fr)
        setRoleEn(exp.role_en)
        setCompany(exp.company)
        setPeriod(exp.period)
        setDescFr(exp.description_fr)
        setDescEn(exp.description_en)
        setIsActive(exp.is_active)
      })
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const payload: ExperiencePayload = {
      role_fr: roleFr,
      role_en: roleEn,
      company,
      period,
      description_fr: descFr,
      description_en: descEn,
      is_active: isActive,
    }
    try {
      if (isEdit) {
        await api.experiences.update(authFetch, Number(id), payload)
      } else {
        await api.experiences.create(authFetch, payload)
      }
      navigate('/admin/experiences')
    } catch {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'px-4 py-2.5 rounded-xl outline-none w-full text-sm transition-colors'
  const inputStyle = { background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text)' }
  const labelStyle = { color: 'var(--text-muted)' }

  if (fetching) return <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/experiences')}
          className="flex items-center gap-1.5 text-sm mb-4 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {isEdit ? 'Éditer l\'expérience' : 'Nouvelle expérience'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#f8717122', color: '#f87171', border: '1px solid #f8717144' }}>
            {error}
          </div>
        )}

        {/* Poste */}
        <div
          className="flex flex-col gap-4 p-5 rounded-2xl"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide" style={labelStyle}>Intitulé du poste</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide flex items-center gap-2" style={labelStyle}>
              FR
            </label>
            <input type="text" value={roleFr} onChange={e => setRoleFr(e.target.value)} className={inputClass} style={inputStyle} placeholder="Ex : Développeur Full Stack" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>EN</label>
            <input type="text" value={roleEn} onChange={e => setRoleEn(e.target.value)} className={inputClass} style={inputStyle} placeholder="Ex : Full Stack Developer" />
          </div>
        </div>

        {/* Entreprise & période */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>Entreprise *</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} className={inputClass} style={inputStyle} placeholder="Nom de l'entreprise" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>Période *</label>
            <input type="text" value={period} onChange={e => setPeriod(e.target.value)} className={inputClass} style={inputStyle} placeholder="Ex : 2023 - Aujourd'hui" required />
          </div>
        </div>

        {/* Descriptions */}
        <div
          className="flex flex-col gap-4 p-5 rounded-2xl"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide" style={labelStyle}>Points clés</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>FR</label>
            <TagInput tags={descFr} onChange={setDescFr} placeholder="Ajouter un point…" />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Appuyez sur <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>Entrée</kbd> pour valider chaque point.</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>EN</label>
            <TagInput tags={descEn} onChange={setDescEn} placeholder="Add a bullet point…" />
          </div>
        </div>

        {/* Visibilité */}
        <label
          className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <div className="relative">
            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
            <div className="w-10 h-6 rounded-full transition-colors" style={{ background: isActive ? 'var(--color-brand)' : 'var(--border)' }} />
            <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: isActive ? '22px' : '4px' }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Visible sur le portfolio</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{isActive ? 'Affiché publiquement' : 'Masqué'}</p>
          </div>
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-brand)', color: '#fff' }}
          >
            {loading ? 'Sauvegarde…' : isEdit ? 'Enregistrer' : 'Créer l\'expérience'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/experiences')}
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
