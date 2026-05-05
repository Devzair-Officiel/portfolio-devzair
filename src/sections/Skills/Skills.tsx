import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { skills as staticSkills } from '@/data'
import { api, type ApiCategory } from '@/utils/api'
import { fadeUp, staggerContainer, staggerItem } from '@/utils/animations'
import type { SkillType } from '@/types'

const STATIC_CATEGORIES: ApiCategory[] = [
  { id: 1, key: 'frontend', label_fr: 'Frontend',          label_en: 'Frontend',        accent: '#818cf8', order: 0 },
  { id: 2, key: 'backend',  label_fr: 'Backend',           label_en: 'Backend',         accent: '#34d399', order: 1 },
  { id: 3, key: 'devops',   label_fr: 'DevOps & Outils',   label_en: 'DevOps & Tools',  accent: '#f59e0b', order: 2 },
  { id: 4, key: 'learning', label_fr: 'En apprentissage',  label_en: 'Learning',        accent: '#7c6fff', order: 3 },
]

export const Skills = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const [categories, setCategories] = useState<ApiCategory[]>(STATIC_CATEGORIES)
  const [skillList, setSkillList] = useState<SkillType[]>(staticSkills)

  useEffect(() => {
    Promise.all([api.categories.list(), api.skills.list()]).then(([cats, apiSkills]) => {
      if (cats.length > 0) setCategories(cats)
      if (apiSkills.length > 0) {
        setSkillList(apiSkills.map(s => ({ name: s.name, category: s.category as SkillType['category'] })))
      }
    }).catch(() => {})
  }, [])

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
          {lang === 'en' ? 'Skills' : 'Compétences'}
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {categories.map(({ key, label_fr, label_en, accent }) => {
          const label = lang === 'en' ? label_en : label_fr
          const catSkills = skillList.filter(s => s.category === key)
          return (
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
                  {label}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {catSkills.map(skill => (
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
          )
        })}
      </motion.div>
    </section>
  )
}
