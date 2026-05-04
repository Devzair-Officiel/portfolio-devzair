import { useState, useRef, type KeyboardEvent } from 'react'

interface Props {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export const TagInput = ({ tags, onChange, placeholder = 'Ajouter une techno…' }: Props) => {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const add = () => {
    const value = input.trim()
    if (!value || tags.includes(value)) {
      setInput('')
      return
    }
    onChange([...tags, value])
    setInput('')
  }

  const remove = (tag: string) => {
    onChange(tags.filter(t => t !== tag))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add()
    }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      remove(tags[tags.length - 1])
    }
  }

  return (
    <div
      className="flex flex-wrap gap-2 px-3 py-2.5 rounded-xl cursor-text min-h-[46px]"
      style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'var(--color-brand-glow)', color: 'var(--color-brand)' }}
        >
          {tag}
          <button
            type="button"
            onClick={e => { e.stopPropagation(); remove(tag) }}
            className="rounded-full transition-opacity hover:opacity-60 leading-none"
            style={{ color: 'var(--color-brand)' }}
            aria-label={`Supprimer ${tag}`}
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={add}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-24 bg-transparent outline-none text-sm"
        style={{ color: 'var(--text)' }}
      />
    </div>
  )
}
