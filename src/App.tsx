import { useEffect, useRef, useState } from 'react'
import SiteLayout from './layouts/SiteLayout'
import HomePage from './pages/HomePage'
import { ProjectPage, ProjectsPage } from './pages/WorkPages'
import ResearchPage from './pages/ResearchPage'
import GalleryPage from './pages/GalleryPage'
import AboutPage from './pages/AboutPage'
import { SiteContext } from './lib/SiteContext'
import { projects, type Language } from './data/content'

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
  const firstRender = useRef(true)
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
  const pageNames: Record<string, string> = {
    '/': 'Junyan He',
    '/projects': 'Projects',
    '/research': 'Research',
    '/gallery': 'Gallery',
    '/about': 'About',
  }
  const pageTitle = project?.title ?? pageNames[route] ?? 'Page not found'
  useEffect(() => {
    document.title = `${pageTitle} — cocoJune`
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [route, pageTitle])
  let page
  if (project) page = <ProjectPage key={project.id} project={project} />
  else if (route === '/') page = <HomePage />
  else if (route === '/projects') page = <ProjectsPage />
  else if (route === '/research') page = <ResearchPage />
  else if (route === '/gallery') page = <GalleryPage />
  else if (route === '/about') page = <AboutPage />
  else
    page = (
      <div className="wrapper page-content not-found">
        <p className="eyebrow">
          404 / {language === 'en' ? 'A LITTLE OFF THE PATH' : '走到了另一个地方'}
        </p>
        <h1>{language === 'en' ? 'Nothing here, just yet.' : '这里暂时没有内容。'}</h1>
        <a className="text-link" href="#/">
          {language === 'en' ? 'Back to the collection' : '返回首页'} ↗
        </a>
      </div>
    )
  return (
    <SiteContext.Provider value={{ language, setLanguage }}>
      <SiteLayout route={route}>{page}</SiteLayout>
    </SiteContext.Provider>
  )
}
