import { useSite } from '../lib/SiteContext'

export default function HomePage() {
  const { t } = useSite()
  return (
    <section className="home-page" aria-labelledby="home-title">
      <div className="home-introduction">
        <h1 id="home-title">Junyan He</h1>
        <p>{t('Game design, technical art & visual work.', '游戏设计、技术美术与视觉创作。')}</p>
      </div>
    </section>
  )
}
