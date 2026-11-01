import type { PropsWithChildren } from 'react'
import { useSite } from '../lib/SiteContext'

export default function SiteLayout({ children, route }: PropsWithChildren<{ route: string }>) {
  const { language, setLanguage, t } = useSite()
  const links = [
    ['/', t('Home', '首页')],
    ['/projects', t('Works', '项目')],
    ['/gallery', t('Gallery', '画廊')],
    ['/about', t('About', '关于')],
  ]
  return (
    <div className={`site-shell${route === '/' ? ' is-home' : ''}`}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault()
          document.getElementById('main-content')?.focus()
        }}
      >
        {t('Skip to content', '跳到正文')}
      </a>
      <header className="site-sidebar">
        <a className="site-name" href="#/" aria-label={t('cocoJune — home', 'cocoJune — 首页')}>
          cocoJune
        </a>
        <nav className="main-nav" aria-label={t('Main navigation', '主导航')}>
          {links.map(([href, label]) => {
            const active =
              href === '/'
                ? route === '/'
                : route.startsWith(href) || (href === '/projects' && route === '/research')
            return (
              <a key={href} href={`#${href}`} aria-current={active ? 'page' : undefined}>
                {label}
              </a>
            )
          })}
        </nav>
        <div className="language-switch" role="group" aria-label={t('Language', '语言')}>
          <button
            type="button"
            lang="en"
            aria-label="English"
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            lang="zh-CN"
            aria-label="中文"
            aria-pressed={language === 'zh'}
            onClick={() => setLanguage('zh')}
          >
            中文
          </button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">© {new Date().getFullYear()} Junyan He</footer>
    </div>
  )
}
