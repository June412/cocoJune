import { useSite } from '../../lib/SiteContext'
import { ProjectSketch } from '../../components/ProjectProcess'
import './greeting-card-diagrams.css'

function DownArrow() {
  return <span className="gc-arrow" aria-hidden="true" />
}

export function SystemOverviewDiagram() {
  const { t } = useSite()
  const callbacks = [
    {name:'display', group:t('Rendering','渲染'), leaves:[
      [t('Cover scene','封面'),t('and transition','与转场')],
      [t('Main scene','主场景'),t('Background, campus, hero and fireworks','背景、校园、小猫和烟花')],
    ]},
    {name:'onIdle', group:t('State control','状态控制'), leaves:[
      ['AppStage',t('COVER or MAIN','封面 / 主场景')],
      ['GameState','SEARCHING → FOUND → GUIDING → AT_SWITCH → CELEBRATE'],
    ]},
    {name:'input', group:t('Controls','输入'), leaves:[
      ['keyboard',t('Space, arrow keys, Q','空格、方向键、Q')],
      ['mouse',t('Cat click and lamp movement','点击小猫、移动光源')],
    ]},
  ]
  return <figure className="report-figure gc-diagram" aria-labelledby="gc-overview-caption">
    <div className="gc-sheet">
      <strong className="gc-node gc-entry">main</strong>
      <DownArrow />
      <strong className="gc-node gc-loop">{t('GLUT init and loop','GLUT 初始化与主循环')}</strong>
      <div className="gc-branches">
        {callbacks.map(({ name, group, leaves }) => <section className="gc-branch" key={name} aria-label={name}>
          <DownArrow />
          <strong className="gc-node gc-callback">{name}</strong>
          <div className="gc-group">
            <span className="gc-group-title">{group}</span>
            <dl>{leaves.map(([label, description]) => <div key={label}>
              <dt>{label}</dt>
              <dd>{description}</dd>
            </div>)}</dl>
          </div>
        </section>)}
      </div>
    </div>
    <figcaption id="gc-overview-caption">{t('Figure 1 · Program callbacks and rendering','图 1 · 程序回调与渲染结构')}</figcaption>
  </figure>
}

export function GameStateDiagram() {
  const { t } = useSite()
  const states = [
    ['SEARCHING', 'find-light', t('Find the cat using the light','用灯光寻找小猫')],
    ['FOUND', 'wave-paw', t('Short waving animation','播放挥手动画')],
    ['GUIDING', 'follow-paws', t('Move toward the switch','走向开关')],
    ['AT_SWITCH', 'pull-switch', t('Press SPACE to pull the switch','按空格拉动开关')],
    ['CELEBRATE', 'firework', t('Fireworks and camera pan','烟花绽放，镜头平移')],
    ['DONE', 'campus-panorama', t('Final celebration view','庆典全景')],
  ]
  return <figure className="report-figure gc-diagram" aria-labelledby="gc-state-caption">
    <ol className="gc-states" role="list">
      {states.map(([name, sketch, description], index) => <li key={name}>
        <div className="gc-state gc-node">
          <span className="gc-step" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <ProjectSketch name={sketch} />
          <div><strong>{name}</strong><span>{description}</span></div>
        </div>
        {index < states.length - 1 && <DownArrow />}
      </li>)}
    </ol>
    <figcaption id="gc-state-caption">{t('Figure 2 · Game state flow','图 2 · 游戏状态流程')}</figcaption>
  </figure>
}
