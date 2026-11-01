import { copy, type Project } from '../data/content'
import { useSite } from '../lib/SiteContext'

export default function ProjectCard({ project }: { project: Project }) {
  const { language } = useSite()
  return (
    <a className="project-entry" href={`#/projects/${project.id}`}>
      <h2>{project.title}</h2>
      <span>{copy(project.discipline, language)}</span>
      <time dateTime="2026">2026</time>
    </a>
  )
}
