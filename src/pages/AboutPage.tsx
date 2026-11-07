import { cvUrl, email, github } from '../data/content'
import { useSite } from '../lib/SiteContext'

export default function AboutPage() {
  const { t } = useSite()
  return (
    <div className="wrapper page-content about-page">
      <h1 className="visually-hidden">{t('About', '关于我')}</h1>
      <div className="about-layout">
        <div className="about-biography">
          <h2>Junyan He</h2>
          <p>
            {t(
              'I study Information and Computing Science at Xi’an Jiaotong-Liverpool University. My interests meet in game design, technical art, and interaction research.',
              '我在西交利物浦大学学习信息与计算科学，喜欢游戏设计、技术美术和交互研究。',
            )}
          </p>
          <p>
            {t(
              'I make things with Unity, code, and Blender. I also draw and take photographs. This is a small place for all of them.',
              '我用 Unity、代码和 Blender 做东西，也会画画、拍照。这里放着我的项目和一些日常创作。',
            )}
          </p>
          <dl className="about-notes">
            <div>
              <dt>{t('Education', '教育')}</dt>
              <dd>
                {t('BSc · Information and Computing Science', '信息与计算科学 · 理学学士')}
                <br />
                2023 — 2027 {t('(expected)', '（预计）')}
              </dd>
            </div>
            <div>
              <dt>{t('Tools', '工具')}</dt>
              <dd>
                Unity / C# / HLSL / Blender
                <br />
                Photoshop / React / TypeScript
              </dd>
            </div>
          </dl>
          <div className="about-actions">
            <a className="text-link" href={cvUrl} download="Junyan_He_CV.pdf">
              {t('Download CV', '下载简历')} ↓
            </a>
            <a className="text-link" href="#/research">
              {t('Research & publications', '研究与论文')} ↗
            </a>
          </div>
          <div className="about-contact">
            <a href={`mailto:${email}`}>{email} ↗</a>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub / June412 ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
