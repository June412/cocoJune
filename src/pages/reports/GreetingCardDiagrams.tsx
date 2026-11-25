import './greeting-card-diagrams.css'

const callbacks = [
  { name: 'display', group: 'Rendering', leaves: [
    ['Cover scene', 'and transition'],
    ['Main scene', 'Background, campus, hero and fireworks'],
  ] },
  { name: 'onIdle', group: 'State control', leaves: [
    ['AppStage', 'COVER or MAIN'],
    ['GameState', 'SEARCHING → FOUND → GUIDING → AT_SWITCH → CELEBRATE'],
  ] },
  { name: 'input', group: 'Controls', leaves: [
    ['keyboard', 'Space, arrow keys, q'],
    ['mouse', 'Cat click and lamp move'],
  ] },
]

const states = [
  ['SEARCHING', 'Find the cat using the light'],
  ['FOUND', 'Short waving animation'],
  ['GUIDING', 'Cat can move toward switch'],
  ['AT_SWITCH', 'Press SPACE to pull switch'],
  ['CELEBRATE', 'Fireworks and camera pan'],
  ['DONE', 'Final celebration view'],
]

function DownArrow() {
  return <span className="gc-arrow" aria-hidden="true" />
}

export function SystemOverviewDiagram() {
  return <figure className="report-figure gc-diagram" aria-labelledby="gc-overview-caption">
    <div className="gc-sheet">
      <strong className="gc-node gc-entry">main</strong>
      <DownArrow />
      <strong className="gc-node gc-loop">GLUT init and loop</strong>
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
    <figcaption id="gc-overview-caption">Figure 1 README overview placeholder.</figcaption>
  </figure>
}

export function GameStateDiagram() {
  return <figure className="report-figure gc-diagram" aria-labelledby="gc-state-caption">
    <ol className="gc-states" role="list">
      {states.map(([name, description], index) => <li key={name}>
        <div className="gc-state gc-node">
          <span className="gc-step" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div><strong>{name}</strong><span>{description}</span></div>
        </div>
        {index < states.length - 1 && <DownArrow />}
      </li>)}
    </ol>
    <figcaption id="gc-state-caption">Figure 2 Game State Flow</figcaption>
  </figure>
}
