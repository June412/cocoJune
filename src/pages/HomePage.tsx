import { useSite } from '../lib/SiteContext'
import ProjectArtwork from '../components/ProjectArtwork'
import { Arrow, Flower } from '../components/Icons'

export default function HomePage() {
  const { t } = useSite()
  return (
    <section className="cover wrapper" aria-labelledby="home-title">
      <div className="cover-composition">
        <figure className="cover-study cover-study-left">
          <ProjectArtwork id="textile-toolkit" />
          <figcaption>{t('a material study', '一份材质练习')}</figcaption>
        </figure>
        <div className="cover-copy">
          <p className="cover-hello">{t('Hello, I’m Junyan He.', '你好，我是 Junyan He。')}</p>
          <h1 id="home-title">
            coco<em>June</em>
            <span>.</span>
          </h1>
          <p className="cover-description">
            {t('Games, images & little things.', '做游戏，也画画、拍照。')}
          </p>
          <svg className="cover-thread" viewBox="0 0 180 30" fill="none" aria-hidden="true">
            <path
              d="M2 19c39-16 101-11 129-4 26 7 13 18-3 11-21-9 4-26 49-22"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <figure className="cover-study cover-study-right">
          <ProjectArtwork id="between-sips" />
          <figcaption>{t('a little daydream', '一场小小的白日梦')}</figcaption>
        </figure>
        <Flower className="cover-flower" />
        <span className="cover-handwriting" aria-hidden="true">
          a little bit of me
        </span>
      </div>
      <nav className="cover-entries" aria-label={t('Explore my website', '进入网站')}>
        <a href="#/projects">
          <span className="entry-title">
            {t('Work', '项目')}
            <Arrow diagonal />
          </span>
          <span className="entry-description">
            {t('Games, graphics & research', '游戏、图形与研究')}
          </span>
        </a>
        <a href="#/gallery">
          <span className="entry-title">
            {t('Gallery', '画廊')}
            <Arrow diagonal />
          </span>
          <span className="entry-description">{t('Drawings & photographs', '画画与拍照')}</span>
        </a>
        <a href="#/about">
          <span className="entry-title">
            {t('About', '关于')}
            <Arrow diagonal />
          </span>
          <span className="entry-description">
            {t('A little about me & my CV', '关于我与简历')}
          </span>
        </a>
      </nav>
      <p className="cover-caption">{t('Project concept illustrations', '项目概念插图')}</p>
    </section>
  )
}
