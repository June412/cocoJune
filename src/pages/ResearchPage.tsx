import { projects, copy } from '../data/content'
import { useSite } from '../lib/SiteContext'
import PublicationList from '../components/PublicationList'
import { Arrow } from '../components/Icons'

export default function ResearchPage() {
  const { language, t } = useSite()
  return (
    <div className="wrapper page-content">
      <div className="page-heading">
        <h1>{t('Research', '研究')}</h1>
      </div>
      <section className="research-experiences" aria-labelledby="experience-title">
        <div className="section-heading">
          <h2 id="experience-title">{t('Research experience', '研究经历')}</h2>
        </div>
        {[projects[4], projects[6]].map((project) => (
          <a key={project.id} href={`#/projects/${project.id}`} className="research-row">
            <span className="eyebrow">
              {project.period.replace('Present', t('Present', '至今'))}
            </span>
            <div>
              <h3>{project.title}</h3>
              <p>{copy(project.description, language)}</p>
              <span className="research-role">{copy(project.role, language)}</span>
            </div>
            <Arrow diagonal />
          </a>
        ))}
        <div className="research-row">
          <span className="eyebrow">08.2025 — 04.2026</span>
          <div>
            <h3>{t('Robotic Grasp Detection', '机器人抓取检测')}</h3>
            <p>
              {t(
                'Supported RGB data collection, experimental calibration, parameter tuning, and debugging for real-time robotic grasp detection.',
                '参与实时机器人抓取检测的 RGB 数据采集、实验标定、参数调整与系统调试。',
              )}
            </p>
            <span className="research-role">
              {t(
                'Supervisor: Yong Yue · XJTLU SURF School Winner (team award)',
                '指导老师：Yong Yue · 团队获西交利物浦大学 SURF School Winner',
              )}
            </span>
          </div>
          <a
            className="research-paper-link"
            href="https://doi.org/10.1109/ICAC70325.2026.11712412"
            target="_blank"
            rel="noreferrer"
            aria-label={t('Read robotic grasp detection paper', '阅读机器人抓取检测论文')}
          >
            <Arrow diagonal />
          </a>
        </div>
      </section>
      <section className="publications-section" aria-labelledby="papers-title">
        <div className="section-heading">
          <h2 id="papers-title">{t('Publications', '论文发表')}</h2>
          <span className="eyebrow">03 {t('PAPERS', '篇论文')}</span>
        </div>
        <PublicationList />
      </section>
    </div>
  )
}
