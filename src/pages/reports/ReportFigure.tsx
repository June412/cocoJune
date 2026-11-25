import { assetUrl } from '../../data/projectVisuals'

type Props = {
  folder: 'card' | 'travel'
  files: string[]
  caption: string
  labels?: string[]
  description?: string
  compact?: boolean
}

export default function ReportFigure({ folder, files, caption, labels, description, compact }: Props) {
  return <figure className={compact ? 'report-figure report-figure--compact' : 'report-figure'}>
    <div className="report-plates">{files.map((file, index) => {
      const url = assetUrl(`projects/reports/${folder}/${file}`)
      return <div key={file}>
        <a href={url} target="_blank" rel="noreferrer">
          <img loading="lazy" src={url} alt={labels?.[index] ?? description ?? caption} />
        </a>
        {labels && <small>{labels[index]}</small>}
      </div>
    })}</div>
    <figcaption>{caption}</figcaption>
  </figure>
}
