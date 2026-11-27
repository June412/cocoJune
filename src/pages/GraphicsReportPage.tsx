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
  return <article className="graphics-report coursework-report">
    <a className="eyebrow" href="#/projects/category/tools">← {t('Graphics & tools', '图形与工具')}</a>
    <header id="project-film" className="project-opening">
      <div>
        <h1 className="coursework-title" lang="en">{title}</h1>
        {reportIntroductions[id].map(paragraph => <p key={paragraph.en}>{copy(paragraph, language)}</p>)}
        {visual.link && <a className="text-link" href={visual.link.href} target="_blank" rel="noreferrer"><GitHubIcon /> GitHub ↗</a>}
      </div>
      <ProjectDemoVideo key={id} id={id} title={title} />
    </header>
    <div className="report-transcript coursework-prose">
      <p className="report-handoff">{t('Below is my original project report, with the figures from the submission.', '以下是我的项目报告，配图沿用提交时的版本。')}</p>
      <div className="report-body" lang={language === 'zh' ? 'zh-CN' : 'en'}>{isCard ? <GreetingCardReport /> : <CyberTravelReport />}</div>
    </div>
    <a className="text-link" href="#/projects/category/tools">← {t('Back to graphics & tools', '返回图形与工具')}</a>
  </article>
}
