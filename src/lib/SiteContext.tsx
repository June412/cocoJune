import { createContext, useContext } from 'react'
import type { Language } from '../data/content'

export const SiteContext = createContext<{
  language: Language
  setLanguage: (value: Language) => void
}>({ language: 'en', setLanguage: () => {} })

export function useSite() {
  const context = useContext(SiteContext)
  return { ...context, t: (en: string, zh: string) => (context.language === 'en' ? en : zh) }
}
