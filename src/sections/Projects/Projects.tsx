import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ProjectCard } from '@/components'
import { useProjects } from '@/hooks'
import { fadeUp, staggerContainer, staggerItem } from '@/utils/animations'

export const Projects = () => {
  const { t } = useTranslation()
  const projects = useProjects()

  return (
    <section id="projects" className="py-24 px-6 max-w-4xl mx-auto">
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-center mb-16"
        style={{ color: 'var(--text)' }}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {t('projects.title')}
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {projects.map(project => (
          <motion.div key={project.id} variants={staggerItem}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
