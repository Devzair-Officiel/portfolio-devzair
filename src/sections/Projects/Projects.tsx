import { useTranslation } from 'react-i18next'
import { ProjectCard } from '@/components'
import { useProjects } from '@/hooks'

export const Projects = () => {
  const { t } = useTranslation()
  const projects = useProjects()

  return (
    <section id="projects" className="py-24 px-6 max-w-4xl mx-auto">
      <h2
        className="text-3xl sm:text-4xl font-bold text-center mb-16"
        style={{ color: 'var(--text)' }}
      >
        {t('projects.title')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
