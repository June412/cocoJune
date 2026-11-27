import { assetUrl } from '../data/projectVisuals'

export function ProjectSketch({ name }: { name: string }) {
  return <img className="project-sketch" src={assetUrl(`illustrations/project-sketches/${name}.png`)}
    width="48" height="48" alt="" loading="lazy" decoding="async" />
}

type IllustratedStep = { sketch: string; title: string; detail?: string }

type ProcessProps = { label: string; steps: IllustratedStep[]; layout?: 'list' | 'strip' }

export default function ProjectProcess({ label, steps, layout = 'list' }: ProcessProps) {
  return <ol className={layout === 'strip' ? 'project-process sketch-strip' : 'project-process'} role="list" aria-label={label}>
    {steps.map(({ sketch, title, detail }) => <li key={sketch}>
      <ProjectSketch name={sketch} />
      <div className="process-caption">
        <strong>{title}</strong>
        {detail && <p>{detail}</p>}
      </div>
    </li>)}
  </ol>
}
