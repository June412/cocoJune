import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SiteLayout from './layouts/SiteLayout'
import HomePage from './pages/HomePage'
import { ProjectPage, ProjectsPage } from './pages/WorkPages'
import ResearchPage from './pages/ResearchPage'
import GalleryPage from './pages/GalleryPage'
import AboutPage from './pages/AboutPage'
import { SiteContext } from './lib/SiteContext'
import { copy, galleryCategories, projects, workCategories, type Language } from './data/content'

const getRoute = () => window.location.hash.slice(1).replace(/\/$/, '') || '/'
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
    const onHashChange = () => setRoute(getRoute())
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
  const project = route.startsWith('/projects/')
    ? projects.find((item) => route === `/projects/${item.id}`)
    : undefined
  const workCategory = workCategories.find((item) => route === `/projects/category/${item.id}`)
  const galleryCategory = galleryCategories.find((item) => route === `/gallery/${item.id}`)
  const pageNames: Record<string, string> = {
    '/': 'cocoJune',
    '/projects': language === 'en' ? 'Works' : '项目',
    '/research': language === 'en' ? 'Research' : '研究',
    '/gallery': language === 'en' ? 'Gallery' : '画廊',
    '/about': language === 'en' ? 'About' : '关于',
  }
  const pageTitle =
    project?.title ??
    (workCategory ? copy(workCategory.label, language) : undefined) ??
    (galleryCategory ? copy(galleryCategory.label, language) : undefined) ??
    pageNames[route] ??
    (language === 'en' ? 'Page not found' : '页面不存在')
  useEffect(() => {
    document.title = pageTitle === 'cocoJune' ? 'cocoJune — Junyan He' : `${pageTitle} — cocoJune`
  }, [pageTitle])
  useLayoutEffect(() => {
    if (previousRoute.current === route) return
    previousRoute.current = route
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [route])
  let page
  if (project) page = <ProjectPage key={project.id} project={project} />
  else if (route === '/') page = <HomePage />
  else if (route === '/projects' || workCategory)
    page = <ProjectsPage category={workCategory?.id} />
  else if (route === '/research') page = <ResearchPage />
  else if (route === '/gallery' || galleryCategory)
    page = (
      <GalleryPage
        key={galleryCategory?.id ?? 'drawings'}
        category={galleryCategory?.id ?? 'drawings'}
      />
    )
  else if (route === '/about') page = <AboutPage />
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
