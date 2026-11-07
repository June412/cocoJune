import { copy, projects, workCategories, type Project, type WorkCategory } from '../data/content'
import { useSite } from '../lib/SiteContext'
import ProjectCard from '../components/ProjectCard'
import { Arrow } from '../components/Icons'

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

export function ProjectPage({ project }: { project: Project }) {
  const { language, t } = useSite()
  const related = projects.filter((item) => item.category === project.category)
  const next = related[(related.findIndex((item) => item.id === project.id) + 1) % related.length]
  return (
    <article className="wrapper page-content project-detail">
      <a className="back-link" href={`#/projects/category/${project.category}`}>
        ← {copy(workCategories.find((group) => group.id === project.category)!.label, language)}
      </a>
      <div className="project-detail-heading">
        <p className="eyebrow">{copy(project.discipline, language)}</p>
        <h1>{project.title}</h1>
        <p>{copy(project.description, language)}</p>
      </div>
      <div className="project-facts">
        <div>
          <span>{t('Role', '我的角色')}</span>
          <p>{copy(project.role, language)}</p>
        </div>
        <div>
          <span>{t('Timeline', '时间')}</span>
          <p>{project.period.replace('Present', t('Present', '至今'))}</p>
        </div>
        <div>
          <span>{t('Status', '状态')}</span>
          <p>{project.ongoing ? t('In progress', '进行中') : t('Completed', '已完成')}</p>
        </div>
      </div>
      <div className="project-story">
        <aside>
          <p className="eyebrow">{t('Tools', '工具')}</p>
          <ul className="tool-list">
            {project.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </aside>
        <div className="project-story-body">
          <section>
            <h2>{t('Overview', '项目概述')}</h2>
            <p>{copy(project.overview, language)}</p>
          </section>
          <section>
            <h2>{t('My contribution', '我的工作')}</h2>
            <ol className="contribution-list">
              {project.contributions.map((item, index) => (
                <li key={item.en}>
                  <span>0{index + 1}</span>
                  <p>{copy(item, language)}</p>
                </li>
              ))}
            </ol>
          </section>
          {project.note && <p className="project-note">{copy(project.note, language)}</p>}
          {project.id === 'holdlight' && (
            <a
              className="text-link"
              href="https://doi.org/10.1145/3797867.3829070"
              target="_blank"
              rel="noreferrer"
            >
              {t('Read the ASSETS ’26 paper', '阅读 ASSETS ’26 论文')}
              <Arrow diagonal />
            </a>
          )}
        </div>
      </div>
      <a className="next-project" href={`#/projects/${next.id}`}>
        <span className="eyebrow">{t('Next project', '下一个项目')}</span>
        <span>{next.title}</span>
        <Arrow diagonal />
      </a>
    </article>
  )
}
