import { copy, projects } from '../data/content'
import ProjectOpening from '../components/ProjectOpening'
import { useSite } from '../lib/SiteContext'
import ProjectProcess from '../components/ProjectProcess'

export default function ProjectBrief({ id }: { id: 'between-sips' | 'perspective-freeze' }) {
  const { language, t } = useSite()
  const project = projects.find(item => item.id === id)!
  const game = id === 'between-sips'
  const contributions = project.contributions.map(item => copy(item, language))
  return <article className="graphics-report brief-project">
    <a className="eyebrow" href={'#/projects/category/' + project.category}>← {game ? t('Games & XR', '游戏与 XR') : t('Interaction', '交互设计')}</a>
    <ProjectOpening id="overview" project={id} title={project.title}>
      <p>{copy(project.overview, language)}</p>
      {!game && <p>{t('The sequence uses stills from the Unity prototype. The board keeps its silhouette when frozen. A side view reveals the new depth.', '短片由 Unity 原型截图剪成。在原视点冻结时，板的轮廓保持一致。转到侧面，可以看到它在深度上的变化。')}</p>}
      <p className="project-meta">{copy(project.discipline, language)} · {language === 'zh' ? project.period.replace('Present', '至今') : project.period}</p>
    </ProjectOpening>
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
      <section id="production" data-thread-chapter className="study-section">
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
