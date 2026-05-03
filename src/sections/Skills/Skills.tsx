import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { skills } from '@/data'
import { fadeUp, staggerContainer, staggerItem } from '@/utils/animations'
import type { SkillType } from '@/types'

const CATEGORIES: { key: SkillType['category']; accent: string }[] = [
  { key: 'frontend', accent: '#818cf8' },
  { key: 'backend',  accent: '#34d399' },
  { key: 'devops',   accent: '#f59e0b' },
  { key: 'learning', accent: '#7c6fff' },
]

export const Skills = () => {
  const { t } = useTranslation()

  const grouped = CATEGORIES.reduce<Record<SkillType['category'], SkillType[]>>(
    (acc, { key }) => {
      acc[key] = skills.filter(s => s.category === key)
      return acc
    },
    {} as Record<SkillType['category'], SkillType[]>,
  )

  return (
    <section id="skills" className="py-24 px-6 max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand mb-3">Stack</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ color: 'var(--text)' }}>
          {t('skills.title')}
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {CATEGORIES.map(({ key, accent }) => (
          <motion.div
            key={key}
            className="p-6 rounded-2xl flex flex-col gap-4"
            style={{
              backgroundColor: 'var(--surface-card)',
              backdropFilter: 'var(--glass)',
              WebkitBackdropFilter: 'var(--glass)',
              border: '1px solid var(--border)',
            }}
            variants={staggerItem}
            whileHover={{ borderColor: `${accent}55`, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: accent }} />
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                {t(`skills.categories.${key}`)}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {grouped[key].map(skill => (
                <span
                  key={skill.name}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-default"
                  style={{
                    backgroundColor: `${accent}10`,
                    border: `1px solid ${accent}28`,
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = `${accent}20`
                    e.currentTarget.style.borderColor = `${accent}55`
                    e.currentTarget.style.color = 'var(--text)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = `${accent}10`
                    e.currentTarget.style.borderColor = `${accent}28`
                    e.currentTarget.style.color = 'var(--text-muted)'
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
