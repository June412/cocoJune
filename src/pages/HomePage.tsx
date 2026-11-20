import { Fragment } from 'react'
import { copy } from '../data/content'
import { aboutLinks } from '../data/aboutLinks'
import AboutIllustration from '../components/AboutIllustration'
import { useSite } from '../lib/SiteContext'

export default function HomePage() {
  const { language, t } = useSite()
  return (
    <div className="wrapper page-content home-page">
      <div className="about-biography">
        <h1>{t('Hi, I’m Junyan!', '你好，我是 Junyan！')}</h1>
        <p>{t('You can also call me June.', '你也可以叫我 June。')}</p>
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
      </div>
      <ul className="about-link-list" aria-label={t('Find me and my work', '联系方式与作品入口')}>
        {aboutLinks.map((item) => (
          <li key={item.id}>
            <AboutIllustration item={item} />
            <p>
              {copy(item.intro, language)}
              <a
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                download={item.download}
                lang={item.id === 'email' ? 'en' : undefined}
              >
                {item.id === 'email'
                  ? copy(item.label, language).split(/(?=[@.])/).map((part, index) => (
                      <Fragment key={index}>{index > 0 && <wbr />}{part}</Fragment>
                    ))
                  : copy(item.label, language)}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
