import type { Project } from '../data/content'
import ProjectArtwork from './ProjectArtwork'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <a className="project-card" href={`#/projects/${project.id}`}>
      <div className="project-card-image">
        <ProjectArtwork id={project.id} />
      </div>
      <div className="project-card-caption">
        <h2>{project.title}</h2>
        <span>{project.discipline}</span>
      </div>
    </a>
  )
}
