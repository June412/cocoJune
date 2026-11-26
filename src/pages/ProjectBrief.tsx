import { copy, projects } from '../data/content'
import { assetUrl, projectVisuals } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'

export default function ProjectBrief({ id }: { id: 'between-sips' | 'perspective-freeze' }) {
  const { language, t } = useSite()
  const project = projects.find(item => item.id === id)!
  const visual = projectVisuals[id]
  const game = id === 'between-sips'
  const contributions = project.contributions.map(item => copy(item, language))
  return <article className="graphics-report brief-project">
    <a className="eyebrow" href={'#/projects/category/' + project.category}>← {game ? t('Games & XR', '游戏与 XR') : t('Interaction', '交互设计')}</a>
    <header id="overview">
      <h1 lang="en">{project.title}</h1>
      <p>{copy(project.discipline, language)} · {project.period}</p>
    </header>
    {visual.video ? <video className="brief-film" src={assetUrl(visual.video)} controls playsInline preload="metadata" aria-label={project.title} />
      : visual.illustration && <img className="brief-illustration" src={assetUrl(visual.illustration)} alt={visual.illustrationAlt ? copy(visual.illustrationAlt, language) : ''} />}
    <div className="report-transcript coursework-prose">
      <p>{copy(project.overview, language)}</p>
      <section id="mechanics">
        <h2>{game ? t('Focus and tea brewing', '专注力与泡茶') : t('Building the interaction', '交互原型')}</h2>
        <p>{contributions[0]}</p>
        {game && <p>{contributions[1]}</p>}
      </section>
      <section id="production">
        <h2>{game ? t('Art and animation', '美术与动画') : t('Planned evaluation', '评估计划')}</h2>
        {!game && <p>{contributions[1]}</p>}
        <p>{contributions[2]}</p>
        {project.note && <p>{copy(project.note, language)}</p>}
      </section>
    </div>
  </article>
}
