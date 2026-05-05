import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { api } from '@/utils/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const AdminContentPage = () => {
  const { authFetch } = useAuthContext()
  const [heroTitleFr, setHeroTitleFr] = useState('')
  const [heroTaglineFr, setHeroTaglineFr] = useState('')
  const [heroTitleEn, setHeroTitleEn] = useState('')
  const [heroTaglineEn, setHeroTaglineEn] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
        setGithubUrl(map['github_url'] ?? '')
        setLogoUrl(map['logo_url'] ?? null)
      })
      .finally(() => setFetching(false))
  }, [])

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoError(null)
    setLogoUploading(true)
    try {
      const { url } = await api.upload.logo(authFetch, file)
      setLogoUrl(url)
    } catch {
      setLogoError('Erreur lors de l\'upload')
    } finally {
      setLogoUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setLoading(true)
    try {
      await Promise.all([
        heroTitleFr && api.settings.upsert(authFetch, 'hero_title_fr', heroTitleFr),
        heroTaglineFr && api.settings.upsert(authFetch, 'hero_tagline_fr', heroTaglineFr),
        heroTitleEn && api.settings.upsert(authFetch, 'hero_title_en', heroTitleEn),
        heroTaglineEn && api.settings.upsert(authFetch, 'hero_tagline_en', heroTaglineEn),
        api.settings.upsert(authFetch, 'github_url', githubUrl),
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
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Intro</h1>
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

        {/* Logo */}
        <div
          className="flex flex-col gap-4 p-5 rounded-2xl"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Logo</h2>
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {logoUrl ? (
                <img
                  src={`${API_URL}${logoUrl}`}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/devzair.png"
                  alt="Logo par défaut"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{ background: 'var(--color-brand)', color: '#fff', opacity: logoUploading ? 0.6 : 1, pointerEvents: logoUploading ? 'none' : 'auto' }}
              >
                {logoUploading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Upload…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Choisir un fichier
                  </>
                )}
              </label>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PNG, JPEG, WEBP ou SVG · max 2 Mo</p>
              {logoError && <p className="text-xs" style={{ color: '#f87171' }}>{logoError}</p>}
              {logoUrl && !logoUploading && (
                <p className="text-xs" style={{ color: '#34d399' }}>Logo mis à jour ✓</p>
              )}
            </div>
          </div>
        </div>

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

        {/* Liens */}
        <div
          className="flex flex-col gap-5 p-5 rounded-2xl"
          style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Liens</h2>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={labelStyle}>URL GitHub</label>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-muted)" className="shrink-0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.755-1.755-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.52 11.52 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="https://github.com/votre-profil"
              />
            </div>
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
