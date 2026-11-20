import type { PropsWithChildren } from 'react'
import { copy, galleryCategories, workCategories } from '../data/content'
import { useSite } from '../lib/SiteContext'

export default function SiteLayout({ children, route }: PropsWithChildren<{ route: string }>) {
  const { language, setLanguage, t } = useSite()
  const links = [
    ['/projects', t('Works', '项目')],
    ['/gallery', t('Gallery', '画廊')],
    ['/research', t('Research', '研究')],
  ]
  const secondaryLinks = route.startsWith('/projects')
    ? [
        { href: '/projects', label: t('All works', '全部项目'), active: route === '/projects' },
        ...workCategories.map((category) => ({
          href: `/projects/category/${category.id}`,
          label: copy(category.label, language),
          active: route === `/projects/category/${category.id}`,
        })),
      ]
    : route.startsWith('/gallery')
      ? galleryCategories.map((category) => ({
          href: `/gallery/${category.id}`,
          label: copy(category.label, language),
          active:
            route === `/gallery/${category.id}` ||
            (route === '/gallery' && category.id === 'all'),
        }))
      : []
  return (
    <div className={`site-shell${route === '/' ? ' is-home' : ''}${route.startsWith('/projects') ? ' is-work' : ''}`}>
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
      <header className="site-header">
        <a
          className="site-name"
          href="#/"
          aria-current={route === '/' ? 'page' : undefined}
          aria-label={t('Junyan He — home', 'Junyan He — 首页')}
        >
          <span className="wordmark" aria-hidden="true" lang="en">JUNYAN HE</span>
        </a>
        <div className="header-navigation">
          <nav className="main-nav" aria-label={t('Main navigation', '主导航')}>
            {links.map(([href, label]) => (
              <a
                key={href}
                href={`#${href}`}
                aria-current={route.startsWith(href) ? 'page' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="category-nav-slot">
            {secondaryLinks.length > 0 && (
              <nav
                key={route.startsWith('/projects') ? 'projects' : 'gallery'}
                className={`secondary-nav${route.startsWith('/projects') ? ' secondary-nav--works' : ''}`}
                aria-label={t('Categories', '分类')}
              >
                {secondaryLinks.map((link) => (
                  <a
                    key={link.href}
                    href={`#${link.href}`}
                    aria-current={link.active ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
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
      <main id="main-content" className={route.startsWith('/gallery') ? 'gallery-main' : undefined} tabIndex={-1}>
        <div key={route} className="page-transition">
          {children}
        </div>
      </main>
      <footer className="site-footer">
        <span>© Junyan He</span>
        <span className="font-credit">
          <a href="https://www.dafont.com/cardenio-modern.font" target="_blank" rel="noreferrer">Cardenio Modern by Nils Cordes</a>
          {' · '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>
        </span>
      </footer>
    </div>
  )
}
