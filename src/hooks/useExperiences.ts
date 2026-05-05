import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { experiences as staticExperiences } from '@/data'
import { api, type ApiExperience } from '@/utils/api'

export const useExperiences = (): ApiExperience[] => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('en') ? 'en' : 'fr'

  const fallback: ApiExperience[] = staticExperiences.map((e, i) => ({
    id: e.id,
    role_fr: e.role,
    role_en: e.role,
    company: e.company,
    period: e.period,
    description_fr: e.description,
    description_en: e.description,
    order: i,
    is_active: true,
  }))

  const [experiences, setExperiences] = useState<ApiExperience[]>(fallback)

  useEffect(() => {
    api.experiences.list().then(data => {
      if (data.length > 0) setExperiences(data)
    }).catch(() => {})
  }, [lang])

  return experiences
}
