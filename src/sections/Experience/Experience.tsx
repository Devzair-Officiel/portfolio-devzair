import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useExperiences } from '@/hooks'
import { fadeUp, staggerContainer, staggerItem } from '@/utils/animations'

const DESCRIPTION_KEYS = ['devlead', 'freelance'] as const

export const Experience = () => {
  const { t } = useTranslation()
  const experiences = useExperiences()

  return (
    <section id="experience" className="py-24 px-6 max-w-4xl mx-auto">
      <motion.div
        className="text-center mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand mb-3">
          {t('nav.experience') ?? 'Parcours'}
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ color: 'var(--text)' }}>
          {t('experience.title')}
        </h2>
      </motion.div>

      <motion.div
        className="relative flex flex-col gap-0"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Ligne verticale */}
        <div
          className="absolute left-3 top-3 bottom-3 w-px"
          style={{ background: 'linear-gradient(to bottom, #7c6fff66, transparent)' }}
        />

        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="relative pl-12 pb-10 last:pb-0"
            variants={staggerItem}
          >
            {/* Point timeline */}
            <div
              className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7c6fff, #a78bfa)',
                boxShadow: '0 0 12px #7c6fff55',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white opacity-80" />
            </div>

            {/* Card glass */}
            <div
              className="p-6 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: 'var(--surface-card)',
                backdropFilter: 'var(--glass)',
                WebkitBackdropFilter: 'var(--glass)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
                    {t(`experience.roles.${DESCRIPTION_KEYS[index]}`)}
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {exp.company}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap self-start"
                  style={{
                    background: 'rgba(124,111,255,0.12)',
                    border: '1px solid rgba(124,111,255,0.28)',
                    color: '#a78bfa',
                  }}
                >
                  {exp.period.replace("Aujourd'hui", t('experience.present'))}
                </span>
              </div>

              <ul className="flex flex-col gap-2 mt-4">
                {(
                  t(`experience.descriptions.${DESCRIPTION_KEYS[index]}`, {
                    returnObjects: true,
                  }) as string[]
                ).map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2.5 text-sm leading-relaxed"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span className="text-brand shrink-0 mt-0.5">▸</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
