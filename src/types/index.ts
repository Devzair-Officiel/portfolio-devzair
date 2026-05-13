// Types globaux du portfolio

export interface ProjectType {
  id: number
  title: string
  description: string
  stack: string[]
  repoUrl?: string
  liveUrl?: string
  imageUrl?: string | null
}

export interface SkillType {
  name: string
  category: 'frontend' | 'backend' | 'devops' | 'learning'
  icon?: string | null
  color?: string | null
}

export interface ExperienceType {
  id: number
  role: string
  company: string
  period: string
  description: string[]
}
