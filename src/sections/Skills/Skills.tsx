import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TbQuestionMark } from 'react-icons/tb'
import { skills as staticSkills } from '@/data'
import { api, type ApiCategory } from '@/utils/api'
import { ICON_REGISTRY } from '@/utils/iconRegistry'
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
  const Icon = skill.icon ? (ICON_REGISTRY[skill.icon] ?? TbQuestionMark) : TbQuestionMark
  const color = skill.color ?? '#a0aec0'

  return (
    <motion.div
      className="flex flex-col items-center gap-2.5 cursor-default"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ scale: 1.12 }}
    >
      <motion.div
        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
        whileHover={{
          backgroundColor: `${color}18`,
          borderColor: `${color}60`,
          boxShadow: `0 0 20px ${color}30`,
        }}
        transition={{ duration: 0.2 }}
      >
        <Icon size={26} style={{ color }} />
      </motion.div>
      <span
        className="text-[11px] font-medium text-center leading-tight"
        style={{ color: 'var(--text-muted)', maxWidth: '56px' }}
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
  const [activeKey, setActiveKey] = useState('frontend')
  const tabsRef = useRef<HTMLDivElement>(null)

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

  const activeCategory = categories.find(c => c.key === activeKey)
  const activeSkills = skillList.filter(s => s.category === activeKey)
  const accent = activeCategory?.accent ?? '#818cf8'

  return (
    <section id="skills" className="py-16 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto">
      <motion.div
        className="mb-16 text-center"
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
          Stack{' '}
          <span style={{ color: '#a78bfa' }}>technique</span>
        </h2>
      </motion.div>

      {/* Tabs */}
      <div ref={tabsRef} className="flex justify-center mb-8 sm:mb-12">
        <div
          className="flex flex-wrap justify-center gap-1 p-1 rounded-xl"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {categories.map(({ key, label_fr, label_en, accent: tabAccent }) => {
            const label = lang === 'en' ? label_en : label_fr
            const isActive = key === activeKey
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className="relative px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                style={{ color: isActive ? tabAccent : 'var(--text-muted)' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: `${tabAccent}18`, border: `1px solid ${tabAccent}40` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Separator */}
      <div
        className="h-px mb-10 mx-auto max-w-md"
        style={{ background: `linear-gradient(to right, transparent, ${accent}50, transparent)` }}
      />

      {/* Icon wall */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          className="flex flex-wrap justify-center gap-3 sm:gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {activeSkills.map((skill, i) => (
            <SkillIcon key={skill.name} skill={skill} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
