import { copy, projects, workCategories, type WorkCategory } from '../data/content'
import { useSite } from '../lib/SiteContext'
import ProjectCard from '../components/ProjectCard'

export function ProjectsPage({ category }: { category?: WorkCategory }) {
  const { language, t } = useSite()
  const groups = workCategories.filter((group) => !category || group.id === category)
  return (
    <div className="wrapper page-content">
      <h1 className="visually-hidden">{t('Works', '项目')}</h1>
      {groups.map((group) => (
        <section className="work-group" key={group.id} aria-labelledby={`category-${group.id}`}>
          <h2
            className={category ? 'visually-hidden' : 'category-heading'}
            id={`category-${group.id}`}
          >
            {copy(group.label, language)}
          </h2>
          <div className="project-index">
            {projects
              .filter((project) => project.category === group.id)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
