import { useEffect, useState, type FormEvent } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { api } from '@/utils/api'

export const AdminContentPage = () => {
  const { token } = useAuthContext()
  const [heroTitleFr, setHeroTitleFr] = useState('')
  const [heroTaglineFr, setHeroTaglineFr] = useState('')
  const [heroTitleEn, setHeroTitleEn] = useState('')
  const [heroTaglineEn, setHeroTaglineEn] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.settings.list()
      .then(settings => {
        const map: Record<string, string> = {}
        settings.forEach(s => { map[s.key] = s.value })
        setHeroTitleFr(map['hero_title_fr'] ?? '')
        setHeroTaglineFr(map['hero_tagline_fr'] ?? '')
        setHeroTitleEn(map['hero_title_en'] ?? '')
        setHeroTaglineEn(map['hero_tagline_en'] ?? '')
      })
      .finally(() => setFetching(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setLoading(true)
    try {
      await Promise.all([
        heroTitleFr && api.settings.upsert(token!, 'hero_title_fr', heroTitleFr),
        heroTaglineFr && api.settings.upsert(token!, 'hero_tagline_fr', heroTaglineFr),
        heroTitleEn && api.settings.upsert(token!, 'hero_title_en', heroTitleEn),
        heroTaglineEn && api.settings.upsert(token!, 'hero_tagline_en', heroTaglineEn),
      ])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
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

  if (fetching) {
    return <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Contenu</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Modifiez les textes affichés sur votre portfolio.
        </p>
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
        {saved && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: '#34d39922', color: '#34d399', border: '1px solid #34d39944' }}
          >
            Modifications enregistrées !
          </div>
        )}

        {/* Section Hero — FR */}
        <div
          className="flex flex-col gap-5 p-5 rounded-2xl"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Section Hero
            </h2>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
            >
              FR
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
              Titre
            </label>
            <input
              type="text"
              value={heroTitleFr}
              onChange={e => setHeroTitleFr(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="Développeur Full Stack"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
              Phrase d'accroche
            </label>
            <textarea
              value={heroTaglineFr}
              onChange={e => setHeroTaglineFr(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              style={inputStyle}
              placeholder="Je prends en charge l'ensemble d'un projet web…"
            />
          </div>
        </div>

        {/* Section Hero — EN */}
        <div
          className="flex flex-col gap-5 p-5 rounded-2xl"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Section Hero
            </h2>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
            >
              EN
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
              Title
            </label>
            <input
              type="text"
              value={heroTitleEn}
              onChange={e => setHeroTitleEn(e.target.value)}
              className={inputClass}
              style={inputStyle}
              placeholder="Full Stack Developer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>
              Tagline
            </label>
            <textarea
              value={heroTaglineEn}
              onChange={e => setHeroTaglineEn(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              style={inputStyle}
              placeholder="I handle every layer of a web project…"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{ background: 'var(--color-brand)', color: '#fff' }}
          >
            {loading ? 'Sauvegarde…' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
