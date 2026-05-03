interface Props {
  name: string
  isLearning?: boolean
}

export const SkillBadge = ({ name, isLearning = false }: Props) => {
  return (
    <span
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 ${
        isLearning
          ? 'border-brand text-brand'
          : 'hover:border-brand hover:text-brand'
      }`}
      style={{
        backgroundColor: 'var(--surface-alt)',
        borderColor: isLearning ? undefined : 'var(--border)',
        color: isLearning ? undefined : 'var(--text)',
      }}
    >
      {name}
    </span>
  )
}
