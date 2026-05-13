import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ProjectCard } from '@/components'
import { useProjects } from '@/hooks'

export const Projects = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'
  const { projects, loading, error } = useProjects()

  return (
    <section id="projects" className="py-24 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
      >
        <span className="section-label">// projects</span>
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
          {t('projects.title')}
        </h2>
      </motion.div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card h-56 animate-pulse opacity-30" />
          ))}
        </div>
      )}

      {error && (
        <p style={{ color: '#f87171', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          Error: failed to load projects
        </p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              className="h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: idx * 0.09 }}
            >
              <ProjectCard project={project} index={idx} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
