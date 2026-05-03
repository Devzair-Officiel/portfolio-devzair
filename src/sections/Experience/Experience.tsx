import { useTranslation } from 'react-i18next'
import { useExperiences } from '@/hooks'

const DESCRIPTION_KEYS = ['devlead', 'freelance'] as const

export const Experience = () => {
  const { t } = useTranslation()
  const experiences = useExperiences()

  return (
    <section id="experience" className="py-24 px-6 max-w-4xl mx-auto">
      <h2
        className="text-3xl sm:text-4xl font-bold text-center mb-16"
        style={{ color: 'var(--text)' }}
      >
        {t('experience.title')}
      </h2>

      <div className="relative flex flex-col gap-0">
        {/* Ligne verticale de la timeline */}
        <div
          className="absolute left-3 top-2 bottom-2 w-px"
          style={{ backgroundColor: 'var(--border)' }}
        />

        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-10 pb-12 last:pb-0">
            {/* Point de la timeline */}
            <div
              className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-brand flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              <div className="w-2 h-2 rounded-full bg-brand" />
            </div>

            <div
              className="p-6 rounded-2xl border"
              style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                  {t(`experience.roles.${DESCRIPTION_KEYS[index]}`)}
                </h3>
                <span className="text-sm font-medium text-brand whitespace-nowrap">
                  {exp.period.replace('Aujourd\'hui', t('experience.present'))}
                </span>
              </div>

              <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
                {exp.company}
              </p>

              <ul className="flex flex-col gap-2">
                {(t(`experience.descriptions.${DESCRIPTION_KEYS[index]}`, { returnObjects: true }) as string[]).map(
                  (point, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="text-brand mt-0.5 shrink-0">▸</span>
                      {point}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
