import { projects } from '@/data'
import type { ProjectType } from '@/types'

// Phase 2 : remplacer le corps de ce hook par un appel fetch vers l'API FastAPI.
// Les composants qui consomment useProjects n'auront rien à changer.
export const useProjects = (): ProjectType[] => {
  return projects
}
