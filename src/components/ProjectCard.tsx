import { copy, type ProjectEntry } from '../data/content'
import { projectVisuals } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'
import ProjectIllustration from './ProjectIllustration'
import ProjectPreview from './ProjectPreview'

export default function ProjectCard({ project }: { project: ProjectEntry }) {
  const { language, t } = useSite()
  const link = projectVisuals[project.id].link
  return (
    <article className="project-entry" aria-labelledby={`project-${project.id}`}>
      <ProjectPreview id={project.id} title={project.title} />
      <div className="project-caption">
        <h3 id={`project-${project.id}`} lang="en">{project.title}</h3>
        {link ? <a className="project-action" href={link.href} target="_blank" rel="noreferrer">{copy(link.label, language)}</a> :
          <span className="project-action project-action-pending">{t('Link coming soon', '项目链接待补充')}</span>}
      </div>
      <ProjectIllustration id={project.id} />
    </article>
  )
}
