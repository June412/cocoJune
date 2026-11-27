import { holdLightPaper } from '../data/content'
import { assetUrl, projectVisuals } from '../data/projectVisuals'
import ProjectDemoVideo from '../components/ProjectDemoVideo'
import { useSite } from '../lib/SiteContext'

export default function HoldLightPage() {
  const { t } = useSite()
  const visual = projectVisuals.holdlight
  return (
    <article className="graphics-report holdlight-page">
      <a className="eyebrow" href="#/projects/category/research">← {t('Interaction', '交互设计')}</a>
      <header id="holdlight-demo">
        <h1 lang="en">HoldLight</h1>
        {visual.illustration && <img className="holdlight-climber" src={assetUrl(visual.illustration)} alt="" width="82" height="82" />}
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
            <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 13q6-3 12-8 6 5 13 7M8 13q15 .5 31-1l1 26-5 5q-14-1-26 0Z" />
              <path d="m34 43 .5-5.5L40 38M14 18l13-.4M14 21l7-.3" />
              <path d="M14 36q5-2 6-6t7-3 7-6" strokeDasharray="1 3" />
              <path d="m13 34 2-1 1.5 2-3 1Zm11-6 1-2 2 .5.4 2ZM32 21l2-2 2 1-1 2Z" fill="currentColor" strokeWidth=".8" />
              <circle cx="23" cy="5" r="1.5" fill="currentColor" />
            </svg>
            <span>{t('Poster (PDF)', '海报（PDF）')}</span>
          </a>
          <a className="holdlight-resource" href={holdLightPaper.url} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 11-1 31 26 1M12 6l18-1 9 8-1 25-27 1Z" />
              <path d="m30 5 .3 9 8.7-1M16 14l9-.5M16 19l17-.7M16 25l6-.2M16 29l6-.2M16 33l5-.2M26 24v8l7-.3M28 28.5l2-2 2 1 2-4" />
            </svg>
            <span>{t('View paper', '查看论文')}</span>
          </a>
        </nav>
      </header>
      <ProjectDemoVideo id="holdlight" title="HoldLight" />
      <div className="report-transcript">
        <section aria-labelledby="holdlight-overview">
          <h2 id="holdlight-overview">{t('About the project', '项目介绍')}</h2>
          <p>{t(
            'HoldLight began as a group project for CPT208, the human–computer interaction course I took in the second semester of my third year. It was where I first began to think seriously about accessibility.',
            'HoldLight 最初是我大三下学期人机交互课程 CPT208 的小组作业。我也是从这门课开始认真关注无障碍设计的。',
          )}</p>
          <p>{t(
            'With guidance from our instructor, we focused on blind and low-vision (BLV) climbers. If you can’t see the whole wall, how do you get to know a route before you climb? Once you’re on the wall, how do you know which hold to reach for next?',
            '在老师的指导下，我们把注意力放在盲人和低视力（BLV）攀岩者身上。如果看不清整面岩壁，怎样在上墙前了解路线？上墙后，又怎样知道下一步该找哪个岩点？',
          )}</p>
          <ol className="project-process" aria-label={t('Route guidance sequence','路线引导流程')}>
            <li>{t('Scan the wall','扫描岩壁')}</li>
            <li>{t('Preview the route in layers','分层预览路线')}</li>
            <li>{t('Hear the next hold','听取下一岩点提示')}</li>
          </ol>
          <p>{t('Climbers preview the route on the ground, then hear cues through headphones on the wall. Human safety support and requests for help remain available throughout.', '攀岩者在地面先熟悉路线，上墙后用耳机听取提示。人工安全保护和求助渠道贯穿全程。')}</p>
        </section>
        <section aria-labelledby="holdlight-role">
          <h2 id="holdlight-role">{t('My role', '我的职责')}</h2>
          <p>{t(
            'I designed the UI from the first prototype through the final interface and built the platform’s front end. As I connected scanning, preview and guidance, I considered what a low-vision climber could see on screen and what someone relying on voice cues needed to hear at each step.',
            '我负责从原型到最终界面的 UI 设计和平台前端开发。把扫描、预览和引导串成一个流程时，我既要考虑低视力用户在屏幕上能看清什么，也要考虑主要依靠语音的用户在每一步需要听到什么。',
          )}</p>
          <p>{t(
            'I also contributed to user surveys and to the algorithms for extracting and classifying hold colors. I led the production of our course portfolio and poster.',
            '我也参与了用户调查，以及岩点颜色特征提取与分类算法的开发，并主导了课程作品集和海报的制作。',
          )}</p>
        </section>
      </div>
    </article>
  )
}
