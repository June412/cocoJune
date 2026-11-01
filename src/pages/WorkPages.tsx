import { copy, projects, type Project } from '../data/content'
import { useSite } from '../lib/SiteContext'
import ProjectCard from '../components/ProjectCard'
import ProjectArtwork from '../components/ProjectArtwork'
import { Arrow } from '../components/Icons'

export function ProjectsPage() {
  const { t } = useSite()
  return (
    <div className="wrapper page-content">
      <div className="page-heading collection-heading">
        <div>
          <h1>
            {t('Work', '项目')}
            <em>.</em>
          </h1>
          <p>{t('Games, graphics & interactions.', '游戏、图形与交互。')}</p>
        </div>
        <a className="text-link" href="#/research">
          {t('Research & publications', '研究与论文')} ↗
        </a>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <p className="collection-note">
        {t(
          'Concept covers for now. Project captures to come.',
          '封面暂为项目概念插图，实际截图待补充。',
        )}
      </p>
    </div>
  )
}

export function ProjectPage({ project }: { project: Project }) {
  const { language, t } = useSite()
  const next =
    projects[(projects.findIndex((item) => item.id === project.id) + 1) % projects.length]
  return (
    <article className="wrapper page-content project-detail">
      <a className="back-link" href="#/projects">
        ← {t('All projects', '全部项目')}
      </a>
      <div className="project-detail-heading">
        <p className="eyebrow">{project.discipline}</p>
        <h1>{project.title}</h1>
        <p>{copy(project.description, language)}</p>
      </div>
      <div className="project-facts">
        <div>
          <span>{t('ROLE', '我的角色')}</span>
          <p>{copy(project.role, language)}</p>
        </div>
        <div>
          <span>{t('TIMELINE', '时间')}</span>
          <p>{project.period.replace('Present', t('Present', '至今'))}</p>
        </div>
        <div>
          <span>{t('STATUS', '状态')}</span>
          <p>
            <i className={`status-dot${project.ongoing ? '' : ' completed'}`} />
            {project.ongoing ? t('In progress', '进行中') : t('Completed', '已完成')}
          </p>
        </div>
      </div>
      <figure className="project-detail-figure">
        <ProjectArtwork id={project.id} />
        <figcaption>
          {t(
            'Concept illustration · a visual interpretation of the project, not an in-game capture.',
            '项目概念插图 · 对项目主题的视觉表达，并非实际运行截图。',
          )}
        </figcaption>
      </figure>
      <div className="project-story">
        <aside>
          <p className="eyebrow">{t('THE TOOLBOX', '使用工具')}</p>
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
        <span className="eyebrow">{t('NEXT PROJECT', '下一个项目')}</span>
        <span>{next.title}</span>
        <Arrow diagonal />
      </a>
    </article>
  )
}
