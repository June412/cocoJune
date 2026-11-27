import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SiteLayout from './layouts/SiteLayout'
import ProjectReader from './components/ProjectReader'
import ProjectBrief from './pages/ProjectBrief'
import HomePage from './pages/HomePage'
import { ProjectsPage } from './pages/WorkPages'
import ResearchPage from './pages/ResearchPage'
import GalleryPage from './pages/GalleryPage'
import GraphicsReportPage from './pages/GraphicsReportPage'
import HoldLightPage from './pages/HoldLightPage'
import XrayPage from './pages/XrayPage'
import { portfolioDocumentUrl } from './data/projectRoutes'
import { isReportId } from './data/graphicsReports'
import { SiteContext } from './lib/SiteContext'
import { copy, galleryCategories, projectIndex, workCategories, type Language } from './data/content'

const redirects = new Map([
  ['/about', '/'],
  ['/gallery/drawings', '/gallery/illustrations'],
  ['/gallery/photographs', '/gallery/illustrations'],
  ['/gallery/on-paper', '/gallery/illustrations'],
])
const currentPath = () => window.location.hash.slice(1).split('#', 1)[0].replace(/\/$/, '') || '/'
const getRoute = () => {
  const route = currentPath()
  return redirects.get(route) ?? route
}
function initialLanguage(): Language {
  const requested = new URLSearchParams(window.location.search).get('lang')
  if (requested === 'zh' || requested === 'en') return requested
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
  const portfolioUrl = portfolioDocumentUrl(route, language)
  useLayoutEffect(() => {
    if (portfolioUrl) window.location.replace(portfolioUrl)
  }, [portfolioUrl])
  useEffect(() => {
    const onHashChange = () => {
      const redirect = redirects.get(currentPath())
      if (redirect) window.history.replaceState(null, '', `#${redirect}`)
      setRoute(getRoute())
    }
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    const restoreLanguage = (event: PageTransitionEvent) => {
      if (event.persisted) setLanguage(initialLanguage())
    }
    window.addEventListener('pageshow', restoreLanguage)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('pageshow', restoreLanguage)
    }
  }, [])
  useEffect(() => {
    const address = new URL(window.location.href)
    if (address.searchParams.get('lang') !== language) {
      address.searchParams.set('lang', language)
      try { window.history.replaceState(null, '', address.href) } catch { /* Some file URLs restrict history changes. */ }
    }
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem('cocojune-language', language)
    } catch {
      /* Browsing works when storage is unavailable. */
    }
  }, [language])
  const workCategory = workCategories.find((item) => route === `/projects/category/${item.id}`)
  const detailProject = projectIndex.find(item => route === `/projects/${item.id}`)
  const galleryCategory = galleryCategories.find((item) => route === `/gallery/${item.id}`)
  const pageNames: Record<string, string> = {
    '/': 'Junyan He',
    '/projects': language === 'en' ? 'Works' : '项目',
    '/research': language === 'en' ? 'Research' : '研究',
    '/gallery': language === 'en' ? 'Gallery' : '画廊',
  }
  const pageTitle =
    detailProject?.title ??
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
  if (portfolioUrl) return <a href={portfolioUrl}>{detailProject?.title ?? (route.startsWith('/projects/tinyroomies/') ? 'TinyRoomies' : 'Alice · Mending Workshop')}</a>
  let page
  if (route === '/') page = <HomePage />
  else if (detailProject?.id === 'holdlight') page = <HoldLightPage />
  else if (detailProject?.id === 'x-ray') page = <XrayPage />
  else if (detailProject?.id === 'between-sips' || detailProject?.id === 'perspective-freeze') page = <ProjectBrief id={detailProject.id} />
  else if (detailProject && isReportId(detailProject.id))
    page = <GraphicsReportPage id={detailProject.id} title={detailProject.title} />
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
      <SiteLayout route={route} projectCategory={detailProject?.category}>{detailProject ? <ProjectReader id={detailProject.id}>{page}</ProjectReader> : page}</SiteLayout>
    </SiteContext.Provider>
  )
}
