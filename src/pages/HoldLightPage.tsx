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
            <img src={assetUrl('illustrations/home-github-line-v1.png')} alt="" width="48" height="48" />
            <span>GitHub</span>
          </a>
          <a className="holdlight-resource" href="https://yuuu-05.github.io/CPT208-ClimbProject-C2-4/" target="_blank" rel="noreferrer">
            <img src={assetUrl('illustrations/home-research-line-v1.png')} alt="" width="48" height="48" />
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
            <p>{t(
              'With guidance from our instructor, we focused on blind and low-vision (BLV) climbers. If you can’t see the whole wall, how do you get to know a route before you climb? Once you’re on the wall, how do you know which hold to reach for next?',
              '在老师的指导下，我们把注意力放在盲人和低视力（BLV）攀岩者身上。如果看不清整面岩壁，怎样在上墙前了解路线？上墙后，又怎样知道下一步该找哪个岩点？',
            )}</p>
            <p>{t('Climbers preview the route on the ground, then hear cues through headphones on the wall. Human safety support and requests for help remain available throughout.', '攀岩者在地面先熟悉路线，上墙后用耳机听取提示。人工安全保护和求助渠道贯穿全程。')}</p>
          </div>
          <ProjectProcess label={t('Route guidance sequence', '路线引导流程')} steps={[
            { sketch: 'scan-holds', title: t('Scan the wall', '扫描岩壁') },
            { sketch: 'hold-route', title: t('Preview the route in layers', '分层预览路线') },
            { sketch: 'audio-cue', title: t('Hear the next hold', '听取下一岩点提示') },
          ]} />
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
          <div>
            <p>{t(
              'I designed the UI from the first prototype through the final interface and built the platform’s front end. As I connected scanning, preview and guidance, I considered what a low-vision climber could see on screen and what someone relying on voice cues needed to hear at each step.',
              '我负责从原型到最终界面的 UI 设计和平台前端开发。把扫描、预览和引导串成一个流程时，我既要考虑低视力用户在屏幕上能看清什么，也要考虑主要依靠语音的用户在每一步需要听到什么。',
            )}</p>
            <p>{t(
              'I also contributed to user surveys and to the algorithms for extracting and classifying hold colors. I led the production of our course portfolio and poster.',
              '我也参与了用户调查，以及岩点颜色特征提取与分类算法的开发，并主导了课程作品集和海报的制作。',
            )}</p>
          </div>
        </section>
      </div>
    </article>
  )
}
