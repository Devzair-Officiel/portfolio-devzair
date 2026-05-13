import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ProjectCard } from '@/components'
import { useProjects } from '@/hooks'

const ACCENT_COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#34d399', '#8b5cf6']

export const Projects = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const { projects, loading, error } = useProjects()

  return (
    <section id="projects" className="py-32 px-6 max-w-6xl mx-auto">
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="section-label mb-4">{lang === 'en' ? 'Selected work' : 'Mes projets'}</p>
        <h2
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
        >
          {t('projects.title')}
        </h2>
      </motion.div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-64 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-center px-5 py-3 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}>
          Impossible de charger les projets.
        </p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              className="h-full"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
            >
              <ProjectCard
                project={project}
                accentColor={ACCENT_COLORS[idx % ACCENT_COLORS.length]}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
