interface Props {
  name: string
  isLearning?: boolean
}

export const SkillBadge = ({ name, isLearning = false }: Props) => {
  return (
    <span
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-default"
      style={
        isLearning
          ? {
              border: '1px solid #7c6fff55',
              color: '#a78bfa',
              backgroundColor: '#7c6fff11',
            }
          : {
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--surface-card)',
            }
      }
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = '#7c6fff55'
        el.style.color = '#a78bfa'
        el.style.boxShadow = '0 0 10px #7c6fff22'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        if (isLearning) {
          el.style.borderColor = '#7c6fff55'
          el.style.color = '#a78bfa'
        } else {
          el.style.borderColor = 'var(--border)'
          el.style.color = 'var(--text-muted)'
        }
        el.style.boxShadow = 'none'
      }}
    >
      {name}
    </span>
  )
}
