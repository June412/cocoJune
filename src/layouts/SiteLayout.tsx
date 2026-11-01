import type { PropsWithChildren } from 'react'
import { cvUrl, email, github } from '../data/content'
import { useSite } from '../lib/SiteContext'

export default function SiteLayout({ children, route }: PropsWithChildren<{ route: string }>) {
  const { language, setLanguage, t } = useSite()
  const isHome = route === '/'
  const links = [
    ['/projects', t('Work', '项目')],
    ['/gallery', t('Gallery', '画廊')],
    ['/about', t('About', '关于')],
  ]
  return (
    <div className={`site-shell${isHome ? ' is-home' : ''}`}>
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
      <header className="site-header wrapper">
        <a
          className={isHome ? 'home-signature' : 'wordmark'}
          href="#/"
          aria-label={t('cocoJune — home', 'cocoJune — 首页')}
        >
          {isHome ? (
            'JUNYAN HE'
          ) : (
            <>
              coco<em>June</em>.
            </>
          )}
        </a>
        <div className="header-right">
          {!isHome && (
            <nav className="main-nav" aria-label={t('Main navigation', '主导航')}>
              {links.map(([href, label]) => {
                const active =
                  route.startsWith(href) || (href === '/projects' && route === '/research')
                return (
                  <a key={href} aria-current={active ? 'page' : undefined} href={`#${href}`}>
                    {label}
                  </a>
                )
              })}
            </nav>
          )}
          <button
            className="language-switch"
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            aria-label={t('Switch to Chinese', 'Switch to English')}
          >
            {language === 'en' ? '中文' : 'EN'}
          </button>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer wrapper">
        <span>© {new Date().getFullYear()} Junyan He</span>
        <div>
          <a href={`mailto:${email}`}>{t('Email', '邮箱')} ↗</a>
          <a href={github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={cvUrl} download="Junyan_He_CV.pdf">
            CV ↓
          </a>
        </div>
      </footer>
    </div>
  )
}
