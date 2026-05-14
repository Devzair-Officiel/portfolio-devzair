const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export type AuthFetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>

export interface ApiExperience {
  id: number
  role_fr: string
  role_en: string
  company: string
  period: string
  description_fr: string[]
  description_en: string[]
  order: number
  is_active: boolean
}

export interface ExperiencePayload {
  role_fr: string
  role_en: string
  company: string
  period: string
  description_fr: string[]
  description_en: string[]
  is_active?: boolean
}

export interface ApiSkill {
  id: number
  name: string
  category: string
  order: number
  icon: string | null
  color: string | null
}

export interface ApiCategory {
  id: number
  key: string
  label_fr: string
  label_en: string
  accent: string
  order: number
}

export interface ApiSetting {
  key: string
  value: string
}

export interface ApiProject {
  id: number
  title: string
  description: string
  stack: string[]
  github_url: string | null
  live_url: string | null
  image_url: string | null
  is_active: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface ProjectPayload {
  title: string
  description: string
  stack: string[]
  github_url?: string | null
  live_url?: string | null
  image_url?: string | null
  is_active?: boolean
}

const json = <T>(res: Response): Promise<T> => {
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  categories: {
    list: async (): Promise<ApiCategory[]> => {
      const res = await fetch(`${API_URL}/api/v1/categories/`)
      return json<ApiCategory[]>(res)
    },

    create: async (authFetch: AuthFetch, data: Omit<ApiCategory, 'id' | 'order'>): Promise<ApiCategory> => {
      const res = await authFetch(`${API_URL}/api/v1/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return json<ApiCategory>(res)
    },

    update: async (authFetch: AuthFetch, id: number, data: Partial<Pick<ApiCategory, 'label_fr' | 'label_en' | 'accent'>>): Promise<ApiCategory> => {
      const res = await authFetch(`${API_URL}/api/v1/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return json<ApiCategory>(res)
    },

    delete: async (authFetch: AuthFetch, id: number): Promise<void> => {
      const res = await authFetch(`${API_URL}/api/v1/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    },

    reorder: async (authFetch: AuthFetch, orderedIds: number[]): Promise<void> => {
      const res = await authFetch(`${API_URL}/api/v1/categories/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedIds),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    },
  },

  skills: {
    list: async (): Promise<ApiSkill[]> => {
      const res = await fetch(`${API_URL}/api/v1/skills/`)
      return json<ApiSkill[]>(res)
    },

    create: async (authFetch: AuthFetch, name: string, category: string, icon?: string | null, color?: string | null): Promise<ApiSkill> => {
      const res = await authFetch(`${API_URL}/api/v1/skills/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, icon: icon ?? null, color: color ?? null }),
      })
      return json<ApiSkill>(res)
    },

    reorder: async (authFetch: AuthFetch, orderedIds: number[]): Promise<void> => {
      const res = await authFetch(`${API_URL}/api/v1/skills/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedIds),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    },

    delete: async (authFetch: AuthFetch, id: number): Promise<void> => {
      const res = await authFetch(`${API_URL}/api/v1/skills/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    },
  },

  settings: {
    list: async (): Promise<ApiSetting[]> => {
      const res = await fetch(`${API_URL}/api/v1/settings/`)
      return json<ApiSetting[]>(res)
    },

    upsert: async (authFetch: AuthFetch, key: string, value: string): Promise<ApiSetting> => {
      const res = await authFetch(`${API_URL}/api/v1/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      })
      return json<ApiSetting>(res)
    },
  },

  experiences: {
    list: async (activeOnly = true): Promise<ApiExperience[]> => {
      const res = await fetch(`${API_URL}/api/v1/experiences/?active_only=${activeOnly}`)
      return json<ApiExperience[]>(res)
    },

    create: async (authFetch: AuthFetch, data: ExperiencePayload): Promise<ApiExperience> => {
      const res = await authFetch(`${API_URL}/api/v1/experiences/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return json<ApiExperience>(res)
    },

    update: async (authFetch: AuthFetch, id: number, data: Partial<ExperiencePayload>): Promise<ApiExperience> => {
      const res = await authFetch(`${API_URL}/api/v1/experiences/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return json<ApiExperience>(res)
    },

    delete: async (authFetch: AuthFetch, id: number): Promise<void> => {
      const res = await authFetch(`${API_URL}/api/v1/experiences/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    },
  },

  upload: {
    logo: async (authFetch: AuthFetch, file: File): Promise<{ url: string }> => {
      const form = new FormData()
      form.append('file', file)
      const res = await authFetch(`${API_URL}/api/v1/upload/logo`, { method: 'POST', body: form })
      return json<{ url: string }>(res)
    },
  },

  projects: {
    list: async (): Promise<ApiProject[]> => {
      const res = await fetch(`${API_URL}/api/v1/projects/?active_only=false`)
      return json<ApiProject[]>(res)
    },

    create: async (authFetch: AuthFetch, data: ProjectPayload): Promise<ApiProject> => {
      const res = await authFetch(`${API_URL}/api/v1/projects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return json<ApiProject>(res)
    },

    update: async (authFetch: AuthFetch, id: number, data: Partial<ProjectPayload>): Promise<ApiProject> => {
      const res = await authFetch(`${API_URL}/api/v1/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return json<ApiProject>(res)
    },

    reorder: async (authFetch: AuthFetch, orderedIds: number[]): Promise<void> => {
      const res = await authFetch(`${API_URL}/api/v1/projects/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedIds),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    },

    delete: async (authFetch: AuthFetch, id: number): Promise<void> => {
      const res = await authFetch(`${API_URL}/api/v1/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    },
  },
}
