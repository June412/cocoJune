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
      {!game && <p>{t('In these Unity prototype stills, the board keeps its silhouette from the original viewpoint. Turn to the side to see its new depth.', '在 Unity 原型截图中，冻结后的板在原视点保持轮廓，侧面则显示出新的深度。')}</p>}
      <p className="project-meta">{copy(project.discipline, language)} · {language === 'zh' ? project.period.replace('Present', '至今') : project.period}</p>
    </ProjectOpening>
    <div className="report-transcript coursework-prose">
      <section id="mechanics" data-thread-chapter className="study-spread">
        <div>
          <h2>{game ? t('Tea brewing', '泡茶机制') : t('Interaction design', '交互设计')}</h2>
          {game ? <ul>
            <li><strong>{t('Focus', '专注力')}</strong> · {t('Videos, books and keepsakes share one capacity limit but affect the uphill journey differently.', '短视频、书籍和纪念物共用容量上限，对上行探索各有影响。')}</li>
            <li><strong>{t('Brewing', '泡茶')}</strong> · {t('Each stage contributes to a weighted score that unlocks areas and memory clues.', '各工序的加权得分可解锁新区域和记忆线索。')}</li>
          </ul> : <p>{contributions[0]}</p>}
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
        {game ? <p>{contributions[2]}</p> : <ul>
          <li><strong>{t('Comparison', '对照方式')}</strong> · {t('Viewpoint interaction and direct 3D manipulation.', '视角交互与直接三维操控。')}</li>
          <li><strong>{t('Measures', '评估指标')}</strong> · {t('Efficiency, accuracy, shape predictability and physical effort.', '效率、精度、形状可预测性与身体负担。')}</li>
          <li><strong>{t('Design exploration', '设计探索')}</strong> · {t('A full VR game built around the viewpoint mechanic.', '围绕视角机制探索完整的 VR 游戏概念。')}</li>
        </ul>}
        {project.note && <p>{copy(project.note, language)}</p>}
      </section>
    </div>
  </article>
}
