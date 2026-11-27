import { copy, projects } from '../data/content'
import { assetUrl, projectVisuals } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'
import ProjectProcess from '../components/ProjectProcess'

export default function ProjectBrief({ id }: { id: 'between-sips' | 'perspective-freeze' }) {
  const { language, t } = useSite()
  const project = projects.find(item => item.id === id)!
  const visual = projectVisuals[id]
  const game = id === 'between-sips'
  const contributions = project.contributions.map(item => copy(item, language))
  return <article className="graphics-report brief-project">
    <a className="eyebrow" href={'#/projects/category/' + project.category}>← {game ? t('Games & XR', '游戏与 XR') : t('Interaction', '交互设计')}</a>
    <header id="overview" data-thread-chapter data-thread-start className="project-opening">
      <div>
        <h1 lang="en">{project.title}</h1>
        <p className="project-meta">{copy(project.discipline, language)} · {language === 'zh' ? project.period.replace('Present', '至今') : project.period}</p>
        <h2 className="project-overview-title">{t('Overview', '项目概览')}</h2>
        <p>{copy(project.overview, language)}</p>
      </div>
      {visual.video ? <video className="brief-film" src={assetUrl(visual.video)} controls playsInline preload="metadata" aria-label={project.title} />
        : visual.illustration && <img className="brief-illustration" src={assetUrl(visual.illustration)} alt={visual.illustrationAlt ? copy(visual.illustrationAlt, language) : ''} />}
    </header>
    <div className="report-transcript coursework-prose">
      <section id="mechanics" data-thread-chapter className="study-spread">
        <div>
          <h2>{game ? t('Tea brewing', '泡茶机制') : t('Interaction design', '交互设计')}</h2>
          <p>{contributions[0]}</p>
          {game && <p>{t('Weighted scores from brewing unlock new areas and clues to the character’s memories.', '各道泡茶工序的加权得分会解锁新区域与记忆线索。')}</p>}
        </div>
        <ProjectProcess layout="strip" label={game ? t('Brewing sequence', '泡茶工序') : t('Viewpoint interaction', '视角交互步骤')} steps={game ? [
          { sketch: 'warm-cup', title: t('Warm the cups', '温器') },
          { sketch: 'pour-water', title: t('Pour water', '注水') },
          { sketch: 'decant-tea', title: t('Decant', '出汤') },
          { sketch: 'serve-tea', title: t('Serve tea', '奉茶') },
        ] : [
          { sketch: 'move-viewpoint', title: t('Move your viewpoint', '移动观察位置') },
          { sketch: 'align-shape', title: t('Align the shape', '对齐目标形状') },
          { sketch: 'freeze-mesh', title: t('Freeze the mesh', '冻结网格') },
        ]} />
      </section>
      <section id="production" data-thread-chapter className="study-spread">
        <h2>{game ? t('Art and animation', '美术与动画') : t('Planned evaluation', '评估计划')}</h2>
        <div>
          {!game && <p>{contributions[1]}</p>}
          <p>{contributions[2]}</p>
          {project.note && <p>{copy(project.note, language)}</p>}
        </div>
      </section>
    </div>
  </article>
}
