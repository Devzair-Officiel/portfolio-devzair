import { useTranslation } from 'react-i18next'
import { SkillBadge } from '@/components'
import { skills } from '@/data'
import type { SkillType } from '@/types'

const CATEGORY_ORDER: SkillType['category'][] = ['frontend', 'backend', 'devops', 'learning']

export const Skills = () => {
  const { t } = useTranslation()

  const grouped = CATEGORY_ORDER.reduce<Record<SkillType['category'], SkillType[]>>(
    (acc, category) => {
      acc[category] = skills.filter(s => s.category === category)
      return acc
    },
    {} as Record<SkillType['category'], SkillType[]>,
  )

  return (
    <section id="skills" className="py-24 px-6 max-w-4xl mx-auto">
      <h2
        className="text-3xl sm:text-4xl font-bold text-center mb-16"
        style={{ color: 'var(--text)' }}
      >
        {t('skills.title')}
      </h2>

      <div className="flex flex-col gap-12">
        {CATEGORY_ORDER.map(category => (
          <div key={category}>
            <h3
              className="text-sm font-semibold uppercase tracking-widest mb-4 text-brand"
            >
              {t(`skills.categories.${category}`)}
            </h3>
            <div className="flex flex-wrap gap-3">
              {grouped[category].map(skill => (
                <SkillBadge
                  key={skill.name}
                  name={skill.name}
                  isLearning={skill.category === 'learning'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
