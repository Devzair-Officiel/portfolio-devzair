import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { skills as staticSkills } from '@/data'
import { api, type ApiCategory } from '@/utils/api'
import type { SkillType } from '@/types'

const STATIC_CATEGORIES: ApiCategory[] = [
  { id: 1, key: 'frontend', label_fr: 'Frontend',         label_en: 'Frontend',       accent: '#818cf8', order: 0 },
  { id: 2, key: 'backend',  label_fr: 'Backend',          label_en: 'Backend',        accent: '#34d399', order: 1 },
  { id: 3, key: 'devops',   label_fr: 'DevOps & Outils',  label_en: 'DevOps & Tools', accent: '#f59e0b', order: 2 },
  { id: 4, key: 'learning', label_fr: 'En apprentissage', label_en: 'Learning',       accent: '#c4b5fd', order: 3 },
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
    <section id="skills" className="py-32 px-6 max-w-6xl mx-auto">
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="section-label mb-4">Stack technique</p>
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="gradient-text-alt">{lang === 'en' ? 'What' : 'Ce que'}</span>{' '}
          <span style={{ color: 'var(--text)' }}>{lang === 'en' ? 'I master' : 'je maîtrise'}</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map(({ key, label_fr, label_en, accent }, idx) => {
          const label = lang === 'en' ? label_en : label_fr
          const catSkills = skillList.filter(s => s.category === key)

          return (
            <motion.div
              key={key}
              className="glass-card p-7 flex flex-col gap-5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}44)` }}
                  />
                  <h3
                    className="text-sm font-bold tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)', color: accent }}
                  >
                    {label}
                  </h3>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                >
                  {catSkills.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {catSkills.map(skill => (
                  <motion.span
                    key={skill.name}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium cursor-default"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                    }}
                    whileHover={{
                      backgroundColor: `${accent}15`,
                      borderColor: `${accent}50`,
                      color: accent,
                      scale: 1.05,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
