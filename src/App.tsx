import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SiteLayout from './layouts/SiteLayout'
import HomePage from './pages/HomePage'
import { ProjectsPage } from './pages/WorkPages'
import ResearchPage from './pages/ResearchPage'
import GalleryPage from './pages/GalleryPage'
import { SiteContext } from './lib/SiteContext'
import { copy, galleryCategories, projects, workCategories, type Language } from './data/content'

const getRoute = () => {
  const route = window.location.hash.slice(1).replace(/\/$/, '') || '/'
  if (route === '/about') return '/'
  if (route === '/gallery/drawings') return '/gallery/illustrations'
  if (route === '/gallery/photographs') return '/gallery/on-paper'
  // Old project bookmarks open the relevant collection instead of a detail page.
  const previousProject = projects.find((item) => route === `/projects/${item.id}`)
  return previousProject ? `/projects/category/${previousProject.category}` : route
}
function initialLanguage(): Language {
  try {
    return localStorage.getItem('cocojune-language') === 'zh' ? 'zh' : 'en'
  } catch {
    return 'en'
  }
}

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const previousRoute = useRef(route)
  useEffect(() => {
    const onHashChange = () => {
      // The former About page now lives at the homepage.
      if (/^#\/about\/?$/.test(window.location.hash)) {
        window.history.replaceState(null, '', '#/')
      }
      setRoute(getRoute())
    }
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem('cocojune-language', language)
    } catch {
      /* Browsing works when storage is unavailable. */
    }
  }, [language])
  const workCategory = workCategories.find((item) => route === `/projects/category/${item.id}`)
  const galleryCategory = galleryCategories.find((item) => route === `/gallery/${item.id}`)
  const pageNames: Record<string, string> = {
    '/': 'Junyan He',
    '/projects': language === 'en' ? 'Works' : '项目',
    '/research': language === 'en' ? 'Research' : '研究',
    '/gallery': language === 'en' ? 'Gallery' : '画廊',
  }
  const pageTitle =
    (workCategory ? copy(workCategory.label, language) : undefined) ??
    (galleryCategory ? copy(galleryCategory.label, language) : undefined) ??
    pageNames[route] ??
    (language === 'en' ? 'Page not found' : '页面不存在')
  useEffect(() => {
    document.title = pageTitle === 'Junyan He' ? 'Junyan He' : `${pageTitle} — Junyan He`
  }, [pageTitle])
  useLayoutEffect(() => {
    if (previousRoute.current === route) return
    previousRoute.current = route
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [route])
  let page
  if (route === '/') page = <HomePage />
  else if (route === '/projects' || workCategory)
    page = <ProjectsPage category={workCategory?.id} />
  else if (route === '/research') page = <ResearchPage />
  else if (route === '/gallery' || galleryCategory)
    page = (
      <GalleryPage
        key={galleryCategory?.id ?? 'all'}
        category={galleryCategory?.id ?? 'all'}
      />
    )
  else
    page = (
      <div className="wrapper page-content not-found">
        <p className="eyebrow">404 / {language === 'en' ? 'Page not found' : '页面不存在'}</p>
        <h1>{language === 'en' ? 'This page does not exist.' : '此页面不存在。'}</h1>
        <a className="text-link" href="#/">
          {language === 'en' ? 'Back to home' : '返回首页'} ↗
        </a>
      </div>
    )
  return (
    <SiteContext.Provider value={{ language, setLanguage }}>
      <SiteLayout route={route}>{page}</SiteLayout>
    </SiteContext.Provider>
  )
}
