import { reportIntroductions, type ReportId } from '../data/graphicsReports'
import { copy } from '../data/content'
import { GitHubIcon } from '../components/Icons'
import { projectVisuals } from '../data/projectVisuals'
import ProjectDemoVideo from '../components/ProjectDemoVideo'
import { useSite } from '../lib/SiteContext'
import GreetingCardReport from './reports/GreetingCardReport'
import CyberTravelReport from './reports/CyberTravelReport'

export default function GraphicsReportPage({ id, title }: { id: ReportId; title: string }) {
  const { t, language } = useSite()
  const visual = projectVisuals[id]
  const isCard = id === 'opengl-2d-greeting-card'
  return <article className="graphics-report">
    <header>
      <a className="eyebrow" href="#/projects/category/tools">← {t('Graphics & tools', '图形与工具')}</a>
      <h1 className="coursework-title" lang="en">{title}</h1>
      {visual.link && <a className="text-link" href={visual.link.href} target="_blank" rel="noreferrer"><GitHubIcon /> GitHub ↗</a>}
    </header>
    <ProjectDemoVideo key={id} id={id} title={title} />
    <div className="report-transcript coursework-prose">
      {reportIntroductions[id].map(paragraph => <p key={paragraph.en}>{copy(paragraph, language)}</p>)}
      <p className="report-handoff">{t('Below is my original project report, with the figures from the submission.', '下面是我的项目报告原文，配图保留自提交版本。')}</p>
      <div lang="en">{isCard ? <GreetingCardReport /> : <CyberTravelReport />}</div>
    </div>
    <a className="text-link" href="#/projects/category/tools">← {t('Back to graphics & tools', '返回图形与工具')}</a>
  </article>
}
