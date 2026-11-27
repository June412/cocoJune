import { useLayoutEffect, useRef, type ReactNode } from 'react'
import type { Language, ProjectId } from '../data/content'
import { useSite } from '../lib/SiteContext'

declare global {
  interface Window {
    ProjectThread: {
      mount(host: HTMLElement, article: HTMLElement, language: Language, route: string): () => void
    }
  }
}

export default function ProjectReader({ id, children }: { id: ProjectId; children: ReactNode }) {
  const { language } = useSite()
  const host = useRef<HTMLDivElement>(null)
  const article = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (host.current && article.current)
      return window.ProjectThread.mount(host.current, article.current, language, '#/projects/' + id)
  }, [id, language])
  return <div className="thread-layout">
    <div ref={host} className="thread-host" data-project={id} />
    <div ref={article} className="thread-copy">{children}</div>
  </div>
}
