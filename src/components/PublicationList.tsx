import { publications } from '../data/content'
import { Arrow } from './Icons'
import { useSite } from '../lib/SiteContext'

export default function PublicationList({ compact = false }: { compact?: boolean }) {
  const { t } = useSite()
  return (
    <ol className={`publication-list${compact ? ' compact' : ''}`}>
      {publications.map((publication) => (
        <li key={publication.id}>
          <span className="publication-number">{publication.id}</span>
          <div className="publication-content">
            <p className="eyebrow">
              {publication.venue} <span> / {publication.year}</span>
            </p>
            <a
              className="publication-title"
              href={publication.url}
              target="_blank"
              rel="noreferrer"
            >
              {publication.title}
              <Arrow diagonal />
            </a>
            {!compact && (
              <p className="publication-authors">
                {publication.authors.split('Junyan He').map((part, index) => (
                  <span key={index}>
                    {index > 0 && <strong>Junyan He</strong>}
                    {part}
                  </span>
                ))}
              </p>
            )}
            {!compact && (
              <a className="quiet-link" href={publication.url} target="_blank" rel="noreferrer">
                {t('Read publication', '阅读论文')} ↗
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
