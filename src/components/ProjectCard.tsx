import { copy, type Project } from '../data/content'
import { useSite } from '../lib/SiteContext'

export default function ProjectCard({ project }: { project: Project }) {
  const { language } = useSite()
  return (
    <a className="project-entry" href={`#/projects/${project.id}`}>
      <h3>{project.title}</h3>
      <span>{copy(project.discipline, language)}</span>
    </a>
  )
}
