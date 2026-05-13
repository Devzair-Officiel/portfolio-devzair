import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useExperiences } from '@/hooks'

export const Experience = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const experiences = useExperiences()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="experience" className="py-16 sm:py-32 px-4 sm:px-6 max-w-4xl mx-auto">
      <motion.div
        className="mb-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="section-label mb-4">{lang === 'en' ? 'Career' : 'Parcours'}</p>
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="gradient-text">{t('experience.title')}</span>
        </h2>
      </motion.div>

      <div ref={containerRef} className="relative">
        {/* Ligne verticale track */}
        <div
          className="absolute left-4.75 top-0 bottom-0 w-px"
          style={{ background: 'var(--border)' }}
        />
        {/* Ligne animée au scroll */}
        <motion.div
          className="absolute left-4.75 top-0 w-px origin-top"
          style={{
            height: lineHeight,
            background: 'linear-gradient(to bottom, #8b5cf6, #06b6d4, #f43f5e)',
          }}
        />

        <div className="flex flex-col gap-0">
          {experiences.map((exp, idx) => {
            const role = lang === 'en' ? exp.role_en : exp.role_fr
            const description = lang === 'en' ? exp.description_en : exp.description_fr
            const dotColors = ['#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b']
            const dotColor = dotColors[idx % dotColors.length]

            return (
              <motion.div
                key={exp.id}
                className="relative pl-12 sm:pl-14 pb-10 sm:pb-14 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
              >
                {/* Dot */}
                <div
                  className="absolute left-0 top-1 w-9.5 h-9.5 rounded-full flex items-center justify-center"
                  style={{
                    background: `${dotColor}18`,
                    border: `2px solid ${dotColor}50`,
                    boxShadow: `0 0 16px ${dotColor}30`,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}` }}
                  />
                </div>

                {/* Card */}
                <div
                  className="glass-card p-4 sm:p-6 flex flex-col gap-3 sm:gap-4"
                  style={{ borderLeft: `2px solid ${dotColor}30` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3
                        className="text-base font-bold mb-1"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                      >
                        {role}
                      </h3>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className="self-start shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
                      style={{
                        background: `${dotColor}12`,
                        border: `1px solid ${dotColor}30`,
                        color: dotColor,
                      }}
                    >
                      {exp.period.replace("Aujourd'hui", t('experience.present'))}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5 mt-1">
                    {description.map((point, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm leading-relaxed"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        <span style={{ color: dotColor, flexShrink: 0, marginTop: '2px', fontSize: '10px' }}>◆</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
