import type { PropsWithChildren } from 'react'
import { copy, galleryCategories, projects, workCategories } from '../data/content'
import { useSite } from '../lib/SiteContext'

export default function SiteLayout({ children, route }: PropsWithChildren<{ route: string }>) {
  const { language, setLanguage, t } = useSite()
  const links = [
    ['/projects', t('Works', '项目')],
    ['/gallery', t('Gallery', '画廊')],
    ['/research', t('Research', '研究')],
    ['/about', t('About', '关于')],
  ]
  const project = projects.find((item) => route === `/projects/${item.id}`)
  const secondaryLinks = route.startsWith('/projects')
    ? [
        { href: '/projects', label: t('All works', '全部项目'), active: route === '/projects' },
        ...workCategories.map((category) => ({
          href: `/projects/category/${category.id}`,
          label: copy(category.label, language),
          active:
            route === `/projects/category/${category.id}` || project?.category === category.id,
        })),
      ]
    : route.startsWith('/gallery')
      ? galleryCategories.map((category) => ({
          href: `/gallery/${category.id}`,
          label: copy(category.label, language),
          active:
            route === `/gallery/${category.id}` ||
            (route === '/gallery' && category.id === 'drawings'),
        }))
      : []
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
        <a
          className="site-name"
          href="#/"
          aria-current={route === '/' ? 'page' : undefined}
          aria-label={t('cocoJune — home', 'cocoJune — 首页')}
        >
          cocoJune
        </a>
        <div className="sidebar-navigation">
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
          {secondaryLinks.length > 0 && (
            <nav className="secondary-nav" aria-label={t('Categories', '分类')}>
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
      <footer className="site-footer">© Junyan He</footer>
    </div>
  )
}
