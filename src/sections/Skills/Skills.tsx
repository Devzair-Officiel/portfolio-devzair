import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { skills as staticSkills } from '@/data'
import { api, type ApiCategory } from '@/utils/api'
import type { SkillType } from '@/types'

const STATIC_CATEGORIES: ApiCategory[] = [
  { id: 1, key: 'frontend', label_fr: 'Frontend',         label_en: 'Frontend',       accent: '#818cf8', order: 0 },
  { id: 2, key: 'backend',  label_fr: 'Backend',          label_en: 'Backend',        accent: '#67e8f9', order: 1 },
  { id: 3, key: 'devops',   label_fr: 'DevOps & Outils',  label_en: 'DevOps & Tools', accent: '#c084fc', order: 2 },
  { id: 4, key: 'learning', label_fr: 'En apprentissage', label_en: 'Learning',       accent: '#fb923c', order: 3 },
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
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
      >
        <span className="section-label">
          {lang === 'en' ? '// skills' : '// compétences'}
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text)',
            lineHeight: 1.15,
          }}
        >
          {lang === 'en' ? 'My stack' : 'Ma stack'}
        </h2>
      </motion.div>

      {/* Grille de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {categories.map(({ key, label_fr, label_en, accent }, idx) => {
          const label = lang === 'en' ? label_en : label_fr
          const catSkills = skillList.filter(s => s.category === key)

          return (
            <motion.div
              key={key}
              className="glass-card p-6 flex flex-col gap-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.09 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: accent,
                      boxShadow: `0 0 8px ${accent}60`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: '15px',
                      color: 'var(--text)',
                    }}
                  >
                    {label}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                  }}
                >
                  {catSkills.length}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {catSkills.map(skill => (
                  <motion.span
                    key={skill.name}
                    className="px-3 py-1.5 text-xs rounded-lg cursor-default"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-muted)',
                    }}
                    whileHover={{
                      backgroundColor: `${accent}14`,
                      borderColor: `${accent}40`,
                      color: accent,
                      y: -2,
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
