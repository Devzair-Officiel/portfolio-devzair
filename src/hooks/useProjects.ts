import { useEffect, useState } from 'react'
import type { ProjectType } from '@/types'

interface ApiProject {
  id: number
  title: string
  description: string
  stack: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  is_active: boolean
}

interface UseProjectsResult {
  projects: ProjectType[]
  loading: boolean
  error: string | null
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const useProjects = (): UseProjectsResult => {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/projects/?active_only=true`)
      .then(res => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`)
        return res.json() as Promise<ApiProject[]>
      })
      .then(data => {
        setProjects(
          data.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            stack: p.stack,
            repoUrl: p.github_url ?? undefined,
            liveUrl: p.live_url ?? undefined,
            imageUrl: p.image_url,
          })),
        )
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      })
      .finally(() => setLoading(false))
  }, [])

  return { projects, loading, error }
}
