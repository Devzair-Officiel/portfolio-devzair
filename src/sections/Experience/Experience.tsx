import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useExperiences } from '@/hooks'

const DOT_COLORS = ['#a78bfa', '#22d3ee', '#f472b6', '#c084fc']

export const Experience = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const experiences = useExperiences()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.3'],
  })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="py-24 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
      >
        <span className="section-label">// experience</span>
        <h2
          className="grad-text-alt"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {t('experience.title')}
        </h2>
      </motion.div>

      {/* Timeline */}
      <div ref={containerRef} className="relative pl-10">
        {/* Track */}
        <div className="timeline-track" />
        {/* Fill animé au scroll */}
        <motion.div
          className="timeline-fill"
          style={{ scaleY: lineScaleY }}
        />

        <div className="flex flex-col gap-10">
          {experiences.map((exp, idx) => {
            const role = lang === 'en' ? exp.role_en : exp.role_fr
            const description = lang === 'en' ? exp.description_en : exp.description_fr
            const color = DOT_COLORS[idx % DOT_COLORS.length]

            return (
              <motion.div
                key={exp.id}
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.07 }}
              >
                {/* Dot sur la timeline */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-2.75rem',
                    top: '6px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}60`,
                    border: '2px solid var(--bg)',
                    zIndex: 1,
                  }}
                />

                {/* Card */}
                <div className="glass-card p-6 flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '17px',
                          fontWeight: 600,
                          color: 'var(--text)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {role}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '14px',
                          color,
                          marginTop: '2px',
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {exp.period.replace("Aujourd'hui", t('experience.present'))}
                    </span>
                  </div>

                  {/* Description */}
                  <ul className="flex flex-col gap-2">
                    {description.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm" style={{ lineHeight: 1.7 }}>
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            flexShrink: 0,
                            marginTop: '9px',
                          }}
                        />
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                          {point}
                        </span>
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
