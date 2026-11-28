import { createElement } from 'react'
import { holdLightPaper } from '../data/content'
import { assetUrl } from '../data/projectVisuals'
import ProjectOpening from '../components/ProjectOpening'
import ProjectProcess, { ProjectSketch } from '../components/ProjectProcess'
import { useSite } from '../lib/SiteContext'

export default function HoldLightPage() {
  const { t } = useSite()
  return (
    <article className="graphics-report holdlight-page">
      <a className="eyebrow" href="#/projects/category/research">← {t('Interaction', '交互设计')}</a>
      <ProjectOpening id="holdlight-demo" project="holdlight" title="HoldLight">
        <p>{t(
          'HoldLight began as a group project for CPT208, the human–computer interaction course I took in the second semester of my third year. It was where I first began to think seriously about accessibility.',
          'HoldLight 最初是我大三下学期人机交互课程 CPT208 的小组作业。我也是从这门课开始认真关注无障碍设计的。',
        )}</p>
        <h3>{t('Project resources', '项目资料')}</h3>
        <nav className="holdlight-resources" aria-label={t('Project resources', '项目资料')}>
          <a className="holdlight-resource" href="https://github.com/Yuuu-05/HoldLight" target="_blank" rel="noreferrer">
            <img src={assetUrl('illustrations/home-github-line-v1.webp')} alt="" width="48" height="48" />
            <span>GitHub</span>
          </a>
          <a className="holdlight-resource" href="https://yuuu-05.github.io/CPT208-ClimbProject-C2-4/" target="_blank" rel="noreferrer">
            <img src={assetUrl('illustrations/home-research-line-v1.webp')} alt="" width="48" height="48" />
            <span>{t('Portfolio', '作品集')}</span>
          </a>
          <a className="holdlight-resource" href={assetUrl('projects/holdlight/poster.pdf')} download="HoldLight-Poster.pdf" aria-label={t('Download poster (PDF)', '下载海报（PDF）')}>
            <ProjectSketch name="poster-sheet" />
            <span>{t('Poster (PDF)', '海报（PDF）')}</span>
          </a>
          <a className="holdlight-resource" href={holdLightPaper.url} target="_blank" rel="noreferrer">
            <ProjectSketch name="research-paper" />
            <span>{t('View paper', '查看论文')}</span>
          </a>
        </nav>
      </ProjectOpening>
      <div className="report-transcript">
        <section aria-labelledby="holdlight-overview" className="study-spread">
          <div>
            <h2 id="holdlight-overview" data-thread-chapter>{t('Route guidance', '路线引导')}</h2>
            <p>{t('With our instructor, we designed guidance for blind and low-vision climbers at two points in a climb.', '在老师的指导下，我们围绕盲人和低视力攀岩者的两个需求设计引导。')}</p>
            <ul>
              <li><strong>{t('On the ground', '上墙前')}</strong> · {t('Get to know the whole route through a layered preview.', '通过分层预览熟悉整条路线。')}</li>
              <li><strong>{t('On the wall', '攀爬中')}</strong> · {t('Hear where to reach next through headphones. A person remains available for help and safety support.', '用耳机听取下一个岩点的位置，现场人员随时提供帮助和安全保护。')}</li>
            </ul>
          </div>
          <div className="guidance-audio">
            <ProjectProcess label={t('Route guidance sequence', '路线引导流程')} steps={[
              { sketch: 'scan-holds', title: t('Scan the wall', '扫描岩壁') },
              { sketch: 'hold-route', title: t('Preview the route in layers', '分层预览路线') },
              { sketch: 'audio-cue', title: t('Hear the next hold', '听取下一岩点提示') },
            ]} />
            {createElement('audio-waveform', {
              'data-en': 'Route guidance · original demo narration',
              'data-zh': '路线引导 · 原演示英文解说',
            }, <audio controls preload="none" src={assetUrl('projects/holdlight/route-guidance-narration.m4a')} aria-label={t('Route guidance narration', '路线引导演示解说')} />)}
          </div>
        </section>
        <section id="holdlight-abstract" data-thread-chapter aria-labelledby="paper-heading" className="study-section">
          <h2 id="paper-heading">{t('Paper abstract', '论文摘要')}</h2>
          <p>{t(
            'Blind and low-vision climbers often rely on others to describe a route and locate the next hold. We designed HoldLight with input from climbers, then used pilot sessions to refine its layered route preview, spoken cues on the wall and option to ask a person for help.',
            '盲人和低视力攀岩者常常需要同伴描述路线、指出下一个岩点。我们从攀岩者的经验出发，通过预试改进了 HoldLight 的三个环节：上墙前分层预览路线、攀爬时听取语音提示，以及在提示不确定时请求人工协助。',
          )}</p>
          <p>{t(
            'In a controlled study, the same participants tried HoldLight and on-demand human guidance. The results suggest that HoldLight helped climbers understand the route before climbing, find their bearings when unsure of the next hold, and resolve routine questions with fewer calls for human help. People continued to oversee safety throughout.',
            '在受控研究中，同一批参与者分别体验了 HoldLight 和按需求助的人工引导。初步结果表明，HoldLight 有助于攀岩者在上墙前理解路线，找不到下一岩点时重新定位，并减少为确认常规路线信息而求助的次数。安全保护始终由现场人员负责。',
          )}</p>
          <a href={holdLightPaper.url} target="_blank" rel="noreferrer">{t('Read the paper at ACM ASSETS', '阅读 ACM ASSETS 论文')} ↗</a>
        </section>
        <section aria-labelledby="holdlight-role" className="study-section">
          <h2 id="holdlight-role" data-thread-chapter>{t('My role', '我的职责')}</h2>
          <ul>
            <li><strong>{t('Interface & front end', '界面与前端')}</strong> · {t('Designed the prototypes and built the final scanning, preview and guidance screens, pairing visual prompts with spoken cues.', '设计原型并开发扫描、预览、引导界面，为各步配上屏幕和语音提示。')}</li>
            <li><strong>{t('Research & algorithms', '调研与算法')}</strong> · {t('Contributed to user surveys and to extracting and classifying hold colours.', '参与用户调查及岩点颜色特征的提取与分类。')}</li>
            <li><strong>{t('Course portfolio', '课程展示')}</strong> · {t('Led production of the portfolio and poster.', '主导课程作品集和海报的制作。')}</li>
          </ul>
        </section>
      </div>
    </article>
  )
}
