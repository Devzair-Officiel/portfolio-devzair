import { useEffect, useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { api, type ApiSkill } from '@/utils/api'

const CATEGORIES = [
  { key: 'frontend', label: 'Frontend', accent: '#818cf8' },
  { key: 'backend',  label: 'Backend',  accent: '#34d399' },
  { key: 'devops',   label: 'DevOps & Outils', accent: '#f59e0b' },
  { key: 'learning', label: 'En apprentissage', accent: '#7c6fff' },
]

export const AdminSkillsPage = () => {
  const { token } = useAuthContext()
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [fetching, setFetching] = useState(true)
  const [newNames, setNewNames] = useState<Record<string, string>>({})
  const [loadingAdd, setLoadingAdd] = useState<Record<string, boolean>>({})
  const [loadingDel, setLoadingDel] = useState<Record<number, boolean>>({})

  useEffect(() => {
    api.skills.list().then(setSkills).finally(() => setFetching(false))
  }, [])

  const handleAdd = async (category: string) => {
    const name = newNames[category]?.trim()
    if (!name) return
    setLoadingAdd(prev => ({ ...prev, [category]: true }))
    try {
      const skill = await api.skills.create(token!, name, category)
      setSkills(prev => [...prev, skill])
      setNewNames(prev => ({ ...prev, [category]: '' }))
    } finally {
      setLoadingAdd(prev => ({ ...prev, [category]: false }))
    }
  }

  const handleDelete = async (id: number) => {
    setLoadingDel(prev => ({ ...prev, [id]: true }))
    try {
      await api.skills.delete(token!, id)
      setSkills(prev => prev.filter(s => s.id !== id))
    } finally {
      setLoadingDel(prev => ({ ...prev, [id]: false }))
    }
  }

  if (fetching) return <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Compétences</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Gérez les technologies affichées sur votre portfolio.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {CATEGORIES.map(({ key, label, accent }) => {
          const categorySkills = skills.filter(s => s.category === key)
          return (
            <div
              key={key}
              className="p-5 rounded-2xl flex flex-col gap-4"
              style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: accent }} />
                <h2 className="text-sm font-semibold" style={{ color: accent }}>{label}</h2>
                <span
                  className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  {categorySkills.length}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {categorySkills.map(skill => (
                  <span
                    key={skill.id}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: 'var(--text)' }}
                  >
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => handleDelete(skill.id)}
                      disabled={loadingDel[skill.id]}
                      className="rounded-full hover:opacity-60 transition-opacity disabled:opacity-30 leading-none"
                      style={{ color: accent }}
                      aria-label={`Supprimer ${skill.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {categorySkills.length === 0 && (
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Aucune techno</p>
                )}
              </div>

              {/* Add input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNames[key] ?? ''}
                  onChange={e => setNewNames(prev => ({ ...prev, [key]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAdd(key)}
                  placeholder="Ajouter une techno…"
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAdd(key)}
                  disabled={loadingAdd[key] || !newNames[key]?.trim()}
                  className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-opacity hover:opacity-80"
                  style={{ background: accent, color: '#fff' }}
                >
                  {loadingAdd[key] ? '…' : 'Ajouter'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
