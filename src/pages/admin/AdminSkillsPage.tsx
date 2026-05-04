import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAuthContext } from '@/context/AuthContext'
import { api, type ApiCategory, type ApiSkill } from '@/utils/api'

// ─── Sortable skill chip ──────────────────────────────────────────────────────

interface SortableSkillProps {
  skill: ApiSkill
  accent: string
  onDelete: (id: number) => void
  deleting: boolean
}

const SortableSkill = ({ skill, accent, onDelete, deleting }: SortableSkillProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id })
  return (
    <span
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: `${accent}15`,
        border: `1px solid ${accent}30`,
        color: 'var(--text)',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg select-none"
      {...attributes}
      {...listeners}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ color: accent, opacity: 0.5, flexShrink: 0 }}>
        <circle cx="3" cy="2.5" r="1"/><circle cx="7" cy="2.5" r="1"/>
        <circle cx="3" cy="5" r="1"/><circle cx="7" cy="5" r="1"/>
        <circle cx="3" cy="7.5" r="1"/><circle cx="7" cy="7.5" r="1"/>
      </svg>
      {skill.name}
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(skill.id) }}
        onPointerDown={e => e.stopPropagation()}
        disabled={deleting}
        className="rounded-full hover:opacity-60 transition-opacity disabled:opacity-30 leading-none"
        style={{ color: accent }}
        aria-label={`Supprimer ${skill.name}`}
      >
        ×
      </button>
    </span>
  )
}

// ─── Add category modal ───────────────────────────────────────────────────────

interface AddCategoryModalProps {
  onClose: () => void
  onAdd: (cat: ApiCategory) => void
  token: string
}

const PRESET_COLORS = ['#818cf8', '#34d399', '#f59e0b', '#7c6fff', '#f87171', '#38bdf8', '#fb923c', '#a78bfa']

const AddCategoryModal = ({ onClose, onAdd, token }: AddCategoryModalProps) => {
  const [labelFr, setLabelFr] = useState('')
  const [labelEn, setLabelEn] = useState('')
  const [accent, setAccent] = useState('#818cf8')
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!labelFr.trim() || !key.trim()) return
    setLoading(true)
    try {
      const cat = await api.categories.create(token, {
        key: key.trim().toLowerCase().replace(/\s+/g, '_'),
        label_fr: labelFr.trim(),
        label_en: labelEn.trim() || labelFr.trim(),
        accent,
      })
      onAdd(cat)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: '#00000066' }}>
      <div
        className="w-full max-w-md flex flex-col gap-5 p-6 rounded-2xl"
        style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Nouvelle catégorie</h2>
          <button onClick={onClose} className="text-lg hover:opacity-60 transition-opacity" style={{ color: 'var(--text-muted)' }}>×</button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Identifiant (slug)</label>
          <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="ex: tools" className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Label FR *</label>
            <input type="text" value={labelFr} onChange={e => setLabelFr(e.target.value)} placeholder="ex: Outils" className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Label EN</label>
            <input type="text" value={labelEn} onChange={e => setLabelEn(e.target.value)} placeholder="ex: Tools" className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Couleur</label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setAccent(c)}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{
                  background: c,
                  boxShadow: accent === c ? `0 0 0 2px var(--surface-alt), 0 0 0 4px ${c}` : 'none',
                }}
              />
            ))}
            <input
              type="color"
              value={accent}
              onChange={e => setAccent(e.target.value)}
              className="w-7 h-7 rounded-full cursor-pointer border-0 outline-none"
              style={{ padding: 0, background: 'none' }}
              title="Couleur personnalisée"
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-4 h-4 rounded-full" style={{ background: accent }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{accent}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !labelFr.trim() || !key.trim()}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 transition-opacity hover:opacity-80"
            style={{ background: accent, color: '#fff' }}
          >
            {loading ? 'Création…' : 'Créer la catégorie'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-70"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export const AdminSkillsPage = () => {
  const { token } = useAuthContext()
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [skills, setSkills] = useState<ApiSkill[]>([])
  const [fetching, setFetching] = useState(true)
  const [newNames, setNewNames] = useState<Record<string, string>>({})
  const [loadingAdd, setLoadingAdd] = useState<Record<string, boolean>>({})
  const [loadingDel, setLoadingDel] = useState<Record<number, boolean>>({})
  const [showAddCat, setShowAddCat] = useState(false)
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    Promise.all([api.categories.list(), api.skills.list()])
      .then(([cats, sk]) => { setCategories(cats); setSkills(sk) })
      .finally(() => setFetching(false))
  }, [])

  const handleDragEnd = (event: DragEndEvent, categoryKey: string) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const catSkills = skills.filter(s => s.category === categoryKey)
    const oldIndex = catSkills.findIndex(s => s.id === active.id)
    const newIndex = catSkills.findIndex(s => s.id === over.id)
    const reordered = arrayMove(catSkills, oldIndex, newIndex)

    setSkills(prev => [
      ...prev.filter(s => s.category !== categoryKey),
      ...reordered,
    ])

    clearTimeout(saveTimers.current[categoryKey])
    saveTimers.current[categoryKey] = setTimeout(() => {
      api.skills.reorder(token!, reordered.map(s => s.id)).catch(() => {})
    }, 600)
  }

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

  const handleDeleteCategory = async (id: number) => {
    await api.categories.delete(token!, id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  if (fetching) return <p style={{ color: 'var(--text-muted)' }}>Chargement…</p>

  return (
    <div className="max-w-3xl">
      {showAddCat && (
        <AddCategoryModal
          token={token!}
          onClose={() => setShowAddCat(false)}
          onAdd={cat => { setCategories(prev => [...prev, cat]); setShowAddCat(false) }}
        />
      )}

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Compétences</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Glissez les technos pour les réordonner.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddCat(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ background: 'var(--color-brand)', color: '#fff' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Catégorie
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {categories.map(({ id, key, label_fr, accent }) => {
          const catSkills = skills.filter(s => s.category === key)
          return (
            <div
              key={id}
              className="p-5 rounded-2xl flex flex-col gap-4"
              style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                <h2 className="text-sm font-semibold" style={{ color: accent }}>{label_fr}</h2>
                <span
                  className="ml-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${accent}18`, color: accent }}
                >
                  {catSkills.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(id)}
                  className="ml-auto text-xs px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                  title="Supprimer la catégorie"
                >
                  Supprimer
                </button>
              </div>

              {/* Sortable chips */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={e => handleDragEnd(e, key)}>
                <SortableContext items={catSkills.map(s => s.id)} strategy={horizontalListSortingStrategy}>
                  <div className="flex flex-wrap gap-2 min-h-9">
                    {catSkills.map(skill => (
                      <SortableSkill
                        key={skill.id}
                        skill={skill}
                        accent={accent}
                        onDelete={handleDelete}
                        deleting={!!loadingDel[skill.id]}
                      />
                    ))}
                    {catSkills.length === 0 && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Aucune techno</p>
                    )}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Add input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNames[key] ?? ''}
                  onChange={e => setNewNames(prev => ({ ...prev, [key]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAdd(key)}
                  placeholder="Ajouter une techno…"
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
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
