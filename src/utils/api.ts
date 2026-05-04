const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface ApiSkill {
  id: number
  name: string
  category: string
  order: number
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
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProjectPayload {
  title: string
  description: string
  stack: string[]
  github_url?: string | null
  live_url?: string | null
  is_active?: boolean
}

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
})

export const api = {
  categories: {
    list: async (): Promise<ApiCategory[]> => {
      const res = await fetch(`${API_URL}/api/v1/categories/`)
      if (!res.ok) throw new Error('Erreur lors du chargement')
      return res.json() as Promise<ApiCategory[]>
    },

    create: async (token: string, data: Omit<ApiCategory, 'id' | 'order'>): Promise<ApiCategory> => {
      const res = await fetch(`${API_URL}/api/v1/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur lors de la création')
      return res.json() as Promise<ApiCategory>
    },

    update: async (token: string, id: number, data: Partial<Pick<ApiCategory, 'label_fr' | 'label_en' | 'accent'>>): Promise<ApiCategory> => {
      const res = await fetch(`${API_URL}/api/v1/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur lors de la mise à jour')
      return res.json() as Promise<ApiCategory>
    },

    delete: async (token: string, id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
    },

    reorder: async (token: string, orderedIds: number[]): Promise<void> => {
      const res = await fetch(`${API_URL}/api/v1/categories/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderedIds),
      })
      if (!res.ok) throw new Error('Erreur lors du réordonnancement')
    },
  },

  skills: {
    list: async (): Promise<ApiSkill[]> => {
      const res = await fetch(`${API_URL}/api/v1/skills/`)
      if (!res.ok) throw new Error('Erreur lors du chargement')
      return res.json() as Promise<ApiSkill[]>
    },

    create: async (token: string, name: string, category: string): Promise<ApiSkill> => {
      const res = await fetch(`${API_URL}/api/v1/skills/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, category }),
      })
      if (!res.ok) throw new Error('Erreur lors de la création')
      return res.json() as Promise<ApiSkill>
    },

    reorder: async (token: string, orderedIds: number[]): Promise<void> => {
      const res = await fetch(`${API_URL}/api/v1/skills/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderedIds),
      })
      if (!res.ok) throw new Error('Erreur lors du réordonnancement')
    },

    delete: async (token: string, id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/api/v1/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
    },
  },

  settings: {
    list: async (): Promise<ApiSetting[]> => {
      const res = await fetch(`${API_URL}/api/v1/settings/`)
      if (!res.ok) throw new Error('Erreur lors du chargement')
      return res.json() as Promise<ApiSetting[]>
    },

    upsert: async (token: string, key: string, value: string): Promise<ApiSetting> => {
      const res = await fetch(`${API_URL}/api/v1/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ value }),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde')
      return res.json() as Promise<ApiSetting>
    },
  },

  projects: {
    list: async (): Promise<ApiProject[]> => {
      const res = await fetch(`${API_URL}/api/v1/projects/?active_only=false`)
      if (!res.ok) throw new Error('Erreur lors du chargement')
      return res.json() as Promise<ApiProject[]>
    },

    create: async (token: string, data: ProjectPayload): Promise<ApiProject> => {
      const res = await fetch(`${API_URL}/api/v1/projects/`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur lors de la création')
      return res.json() as Promise<ApiProject>
    },

    update: async (token: string, id: number, data: Partial<ProjectPayload>): Promise<ApiProject> => {
      const res = await fetch(`${API_URL}/api/v1/projects/${id}`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erreur lors de la mise à jour')
      return res.json() as Promise<ApiProject>
    },

    delete: async (token: string, id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/api/v1/projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
      })
      if (!res.ok) throw new Error('Erreur lors de la suppression')
    },
  },
}
