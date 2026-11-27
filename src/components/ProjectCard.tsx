import { copy, type ProjectEntry } from '../data/content'
import { projectVisuals } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'
import { Arrow } from './Icons'
import ProjectIllustration from './ProjectIllustration'
import ProjectPreview from './ProjectPreview'
import { isReportId } from '../data/graphicsReports'
import { projectDetailUrl } from '../data/projectRoutes'

export default function ProjectCard({ project }: { project: ProjectEntry }) {
  const { language, t } = useSite()
  const link = projectVisuals[project.id].link
  const isReport = isReportId(project.id)
  const detailUrl = projectDetailUrl(project.id, language)
  const detailLabel = isReport ? t('Read project report', '阅读项目报告') : t('View project', '查看项目')
  return (
    <article className="project-entry" aria-labelledby={`project-${project.id}`}>
      {detailUrl ? (
        <a className="report-cover-link" href={detailUrl} aria-label={`${detailLabel} — ${project.title}`}>
          <ProjectPreview id={project.id} title={project.title} />
        </a>
      ) : <ProjectPreview id={project.id} title={project.title} />}
      <div className="project-caption">
        <h3 id={`project-${project.id}`} lang="en">{project.title}</h3>
        {detailUrl && <a className="project-action" href={detailUrl}>{detailLabel} <Arrow className="project-action-arrow" /></a>}
        {!isReport && link && <a className="project-action" href={link.href} target="_blank" rel="noreferrer">{copy(link.label, language)}</a>}
        {!link && !detailUrl && <span className="project-action project-action-pending">{t('Link coming soon', '项目链接待补充')}</span>}
      </div>
      <ProjectIllustration id={project.id} />
    </article>
  )
}
