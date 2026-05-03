import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SkillBadge } from '@/components'
import { skills } from '@/data'
import { fadeUp, staggerContainer, staggerItem } from '@/utils/animations'
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
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-16"
        style={{ color: 'var(--text)' }}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {t('skills.title')}
      </motion.h2>

      <div className="flex flex-col gap-12">
        {CATEGORY_ORDER.map(category => (
          <motion.div
            key={category}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 text-brand">
              {t(`skills.categories.${category}`)}
            </h3>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {grouped[category].map(skill => (
                <motion.div key={skill.name} variants={staggerItem}>
                  <SkillBadge
                    name={skill.name}
                    isLearning={skill.category === 'learning'}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
