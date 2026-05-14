import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { IconQuestionMark } from '@/components/icons/InlineIcons'
import { skills as staticSkills } from '@/data'
import { api, type ApiCategory } from '@/utils/api'
import { ICON_REGISTRY } from '@/utils/iconRegistry'
import { StarField } from '@/components'
import type { SkillType } from '@/types'

const STATIC_CATEGORIES: ApiCategory[] = [
  { id: 1, key: 'frontend', label_fr: 'Frontend',         label_en: 'Frontend',       accent: '#818cf8', order: 0 },
  { id: 2, key: 'backend',  label_fr: 'Backend',          label_en: 'Backend',        accent: '#34d399', order: 1 },
  { id: 3, key: 'devops',   label_fr: 'DevOps & Outils',  label_en: 'DevOps & Tools', accent: '#f59e0b', order: 2 },
  { id: 4, key: 'learning', label_fr: 'En apprentissage', label_en: 'Learning',       accent: '#c4b5fd', order: 3 },
]

interface SkillIconProps {
  skill: SkillType
  index: number
}

const SkillIcon = ({ skill, index }: SkillIconProps) => {
  const Icon = skill.icon ? (ICON_REGISTRY[skill.icon] ?? IconQuestionMark) : IconQuestionMark
  const color = skill.color ?? '#a0aec0'

  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-default group"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      <motion.div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center relative"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        whileHover={{
          backgroundColor: `${color}15`,
          borderColor: `${color}50`,
          boxShadow: `0 4px 20px ${color}25`,
        }}
        transition={{ duration: 0.18 }}
      >
        <Icon size={22} style={{ color }} />
      </motion.div>
      <span
        className="text-[10px] sm:text-[11px] font-medium text-center leading-tight transition-colors duration-150"
        style={{ color: 'var(--text-muted)', maxWidth: '52px' }}
      >
        {skill.name}
      </span>
    </motion.div>
  )
}

export const Skills = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const [categories, setCategories] = useState<ApiCategory[]>(STATIC_CATEGORIES)
  const [skillList, setSkillList] = useState<SkillType[]>(staticSkills)

  useEffect(() => {
    Promise.all([api.categories.list(), api.skills.list()]).then(([cats, apiSkills]) => {
      if (cats.length > 0) setCategories(cats)
      if (apiSkills.length > 0) {
        setSkillList(apiSkills.map(s => ({
          name: s.name,
          category: s.category as SkillType['category'],
          icon: s.icon,
          color: s.color,
        })))
      }
    }).catch(() => {})
  }, [])

  return (
    <section id="skills" className="relative py-16 sm:py-32">
      <StarField />
      <div className="px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Titre */}
      <motion.div
        className="mb-12 sm:mb-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="section-label mb-4">{lang === 'en' ? 'Expertise' : 'Ce que je maîtrise'}</p>
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
        >
          Stack <span style={{ color: '#a78bfa' }}>technique</span>
        </h2>
      </motion.div>

      {/* Rangées */}
      <div>
        {/* Ligne du haut */}
        <motion.div
          className="h-px origin-left"
          style={{ background: 'var(--border)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {categories.map((cat, catIdx) => {
          const label = lang === 'en' ? cat.label_en : cat.label_fr
          const catSkills = skillList.filter(s => s.category === cat.key)
          const num = String(catIdx + 1).padStart(2, '0')

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: catIdx * 0.05 }}
            >
              <div className="flex flex-col sm:flex-row sm:gap-10 py-8 sm:py-10">

                {/* Label catégorie */}
                <div className="relative flex sm:flex-col sm:items-start items-center gap-3 sm:gap-1 sm:w-44 shrink-0 mb-6 sm:mb-0">
                  {/* Grand numéro en fond */}
                  <span
                    className="hidden sm:block absolute -top-3 left-0 font-black leading-none select-none pointer-events-none"
                    style={{
                      fontSize: '5.5rem',
                      color: cat.accent,
                      opacity: 0.06,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {num}
                  </span>

                  {/* Contenu */}
                  <div className="relative flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                    <span
                      className="text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: cat.accent }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs font-medium tabular-nums px-2 py-0.5 rounded-full"
                      style={{ background: `${cat.accent}14`, color: cat.accent }}
                    >
                      {catSkills.length}
                    </span>
                  </div>
                </div>

                {/* Séparateur vertical (desktop only) */}
                <div
                  className="hidden sm:block w-px self-stretch shrink-0"
                  style={{ background: `linear-gradient(to bottom, ${cat.accent}50, transparent)` }}
                />

                {/* Icônes */}
                <div className="flex flex-wrap gap-3 sm:gap-5 flex-1">
                  {catSkills.length > 0
                    ? catSkills.map((skill, i) => (
                        <SkillIcon key={skill.name} skill={skill} index={i} />
                      ))
                    : (
                      <p className="text-xs self-center" style={{ color: 'var(--text-muted)' }}>
                        Aucune techno ajoutée.
                      </p>
                    )
                  }
                </div>
              </div>

              {/* Ligne séparatrice entre catégories */}
              <motion.div
                className="h-px origin-left"
                style={{ background: `linear-gradient(to right, ${cat.accent}40, var(--border) 40%, transparent)` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              />
            </motion.div>
          )
        })}
      </div>
      </div>
    </section>
  )
}
