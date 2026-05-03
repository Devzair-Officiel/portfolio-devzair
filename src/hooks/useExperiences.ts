import { experiences } from '@/data'
import type { ExperienceType } from '@/types'

// Phase 2 : remplacer le corps de ce hook par un appel fetch vers l'API FastAPI.
// Les composants qui consomment useExperiences n'auront rien à changer.
export const useExperiences = (): ExperienceType[] => {
  return experiences
}
