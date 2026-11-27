import type { ReactNode } from 'react'
import type { ProjectId } from '../data/content'
import { assetUrl, projectVisuals } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'
import ProjectDemoVideo from './ProjectDemoVideo'

type Props = {
  project: ProjectId
  title: string
  id: string
  indexed?: boolean
  film?: ReactNode
  children: ReactNode
}

export default function ProjectOpening({ project, title, id, indexed = true, film, children }: Props) {
  const { t } = useSite()
  const illustration = projectVisuals[project].illustration
  return <header id={id} className="project-opening" data-thread-chapter={indexed || undefined} data-thread-start={indexed || undefined}>
    <div className="project-title-row">
      <h1 lang="en">{title}</h1>
      {illustration && <img src={assetUrl(illustration)} width="152" height="152" alt="" />}
    </div>
    <div className="opening-media">{film ?? <ProjectDemoVideo id={project} title={title} />}</div>
    <div className="opening-copy">
      <h2 className="project-overview-title">{t('Overview', '项目概览')}</h2>
      {children}
    </div>
  </header>
}
