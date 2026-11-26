import type { ProjectId, Language } from './content'
import { assetUrl } from './projectVisuals'

const gameTopics = new Set(['arrival', 'alice', 'panda', 'play', 'doll', 'workshop', 'mechanics', 'history'])

const tinyroomiesPages = new Map([
  ['/projects/tinyroomies', ''],
  ['/projects/tinyroomies/design-document', '#game-design'],
  ['/projects/tinyroomies/joinery', '#research'],
])

// These documents also run from disk. Keep the original chapter IDs so existing
// bookmarks enter the corresponding passage in the continuous case study.
export function portfolioDocumentUrl(route: string, language: Language): string | undefined {
  const tinyDocument = tinyroomiesPages.get(route)
  if (tinyDocument !== undefined) return assetUrl(`projects/tinyroomies/index.html?lang=${language}${tinyDocument}`)
  let documentName: string
  let fragment = ''
  if (route === '/projects/alice') documentName = 'game'
  else if (route === '/projects/textile-toolkit') documentName = 'toolkit'
  else if (route === '/projects/alice/technical') {
    documentName = 'game'
    fragment = '#technical-report'
  }
  else if (route.startsWith('/projects/alice/')) {
    const topic = route.slice('/projects/alice/'.length)
    if (!gameTopics.has(topic)) return
    documentName = 'game'
    fragment = '#' + topic
  } else return
  return assetUrl(`projects/alice/${documentName}.html?lang=${language}${fragment}`)
}

export function projectDetailUrl(id: ProjectId, language: Language) {
  const route = `/projects/${id}`
  return portfolioDocumentUrl(route, language) ?? '#' + route
}
