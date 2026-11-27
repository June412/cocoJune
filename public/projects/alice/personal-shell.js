/* Use the personal site's navigation around the authored case studies. The reader
   and its dialogs keep their own document and work from a file URL as well. */
(() => {
  const project = document.body.dataset.page
  const technical = !project
  const toolsProject = project === 'toolkit' || location.pathname.endsWith('/toolkit-slides.html')
  const tinyRoot = document.currentScript.dataset.tinyRoot
  const projectRoot = tinyRoot || './'
  const offline = location.protocol === 'file:' || location.pathname.includes('/public/projects/')
  const personalRoot = projectRoot + (offline ? '../../../Junyan-He.html' : '../../')
  const section = toolsProject ? 'tools' : 'games'
  const technicalLanguage = new URLSearchParams(location.search).get('lang')
  const storageKey = 'cocojune-language'

  function savedLanguage() {
    try { return localStorage.getItem(storageKey) } catch { return null }
  }
  function remember(language) {
    try { localStorage.setItem(storageKey, language) } catch { /* Links also carry the language. */ }
  }

  const header = document.createElement('div')
  const footer = document.createElement('div')
  header.className = 'personal-site-chrome'
  footer.className = 'personal-site-chrome personal-site-bottom'
  const top = header.attachShadow({ mode: 'open' })
  const bottom = footer.attachShadow({ mode: 'open' })
  const backLink = document.createElement('a')
  backLink.className = 'case-return'
  document.body.prepend(header)
  document.body.append(footer)
  const shellSheet = tinyRoot ? tinyRoot + '../alice/personal-shell.css' : 'personal-shell.css'
  const shellStyles = `<link rel="stylesheet" href="${shellSheet}"><link rel="stylesheet" href="${projectRoot}../../styles/site-chrome.css">`
  bottom.innerHTML = shellStyles + `<footer class="site-footer"><span>© Junyan He</span>
    <span class="font-credit"><a href="https://www.dafont.com/cardenio-modern.font" target="_blank" rel="noreferrer">Cardenio Modern by Nils Cordes</a>
    · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></span></footer>`

  const isLanguage = value => value === 'zh' || value === 'en'
  let language, unmountThread
  const mainLinks = [
    ['/projects', 'Works', '项目'], ['/gallery', 'Gallery', '画廊'], ['/research', 'Research', '研究'],
  ]
  const categories = [
    ['/projects', 'All works', '全部项目'], ['/projects/category/games', 'Games & XR', '游戏与 XR'],
    ['/projects/category/tools', 'Graphics & tools', '图形与工具'], ['/projects/category/research', 'Interaction', '交互设计'],
  ]

  function drawChrome(next) {
    if (next === language) return
    language = next
    const zh = next === 'zh'
    header.lang = zh ? 'zh-CN' : 'en'
    footer.lang = header.lang
    backLink.lang = header.lang
    const url = route => personalRoot + '?lang=' + next + '#' + route
    const category = categories.find(([route]) => route.endsWith('/' + section))
    backLink.href = url(category[0])
    backLink.textContent = '← ' + category[zh ? 2 : 1]
    const link = ([route, en, cn], current) =>
      `<a href="${url(route)}"${current ? ' aria-current="location"' : ''}>${zh ? cn : en}</a>`
    top.innerHTML = shellStyles + `<a class="chrome-skip" href="#main">${zh ? '跳到正文' : 'Skip to content'}</a>
      <header class="site-header"><a class="site-name" href="${url('/')}" aria-label="${zh ? 'Junyan He — 首页' : 'Junyan He — home'}">
        <span class="wordmark" lang="en" aria-hidden="true">JUNYAN HE</span></a>
        <div class="header-navigation">
          <nav class="main-nav" aria-label="${zh ? '主导航' : 'Main navigation'}">${mainLinks.map(item => link(item, item[0] === '/projects')).join('')}</nav>
          <div class="category-nav-slot"><nav class="secondary-nav secondary-nav--works" aria-label="${zh ? '分类' : 'Categories'}">
          ${categories.map(item => link(item, item[0] === '/projects/category/' + section)).join('')}</nav></div></div>
        <div class="language-switch" role="group" aria-label="${zh ? '语言' : 'Language'}">
          <button type="button" lang="en" data-language="en" aria-label="English" aria-pressed="${!zh}">EN</button>
          <span aria-hidden="true">/</span><button type="button" lang="zh-CN" data-language="zh" aria-label="中文" aria-pressed="${zh}">中文</button>
        </div></header>`
    if (tinyRoot) {
      document.documentElement.lang = zh ? 'zh-CN' : 'en'
      document.dispatchEvent(new CustomEvent('tinyroomies-language-change', { detail: next }))
      unmountThread?.()
      unmountThread = window.ProjectThread.mount(document.querySelector('.thread-host'), document.getElementById('main'), [
        ['overview', 'Overview', '项目概览', 'Intro', '概览'],
        ['game-design', 'Game design', '游戏设计', 'Design', '设计'],
        ['research', 'Research', '设计调研', 'Study', '调研'],
        ['workshop', 'Workshop', '工坊布局', 'Bench', '工坊'],
        ['assembly', 'Crafting', '制作流程', 'Craft', '制作'],
        ['drawing-design', 'Drawings', '图纸设计', 'Plans', '图纸'],
        ['household', 'Furniture', '家具设计', 'Pieces', '家具'],
        ['space', 'MR & space', '混合现实空间', 'Space', '空间'],
        ['residents', 'Characters', '角色设计', 'Cast', '角色'],
        ['shared-life', 'Shared life', '日常互动', 'Life', '日常'],
        ['iteration', 'Iteration', '原型迭代', 'Tests', '迭代'],
        ['accessibility', 'Accessibility', '无障碍设计', 'Access', '辅助'],
        ['results', 'Results', '技术成果', 'Build', '成果']
      ], next)
    }
    remember(next)
  }

  function placeArticleLinks() {
    const main = document.getElementById('main')
    if (!main) return
    if (main.firstElementChild !== backLink) main.prepend(backLink)
  }

  function setLanguage(next) {
    // Keep the same passage in view when the translated chapter reflows.
    const readingLine = Math.min(160, innerHeight * .2)
    const chapter = tinyRoot && scrollY > 0 && [...document.querySelectorAll('#main > section')].find(section => {
      const box = section.getBoundingClientRect()
      return box.top <= readingLine && box.bottom > readingLine
    })
    const box = chapter && chapter.getBoundingClientRect()
    const fraction = box && (readingLine - box.top) / box.height
    if (technical) {
      const url = new URL(location.href)
      url.searchParams.set('lang', next)
      try { history.replaceState(null, '', url.href) } catch { /* The offline reader remains open. */ }
    } else {
      document.dispatchEvent(new CustomEvent('portfolio-language-change', { detail: next }))
      placeArticleLinks()
    }
    drawChrome(next)
    localizeLinks()
    if (chapter) {
      const translated = chapter.getBoundingClientRect()
      window.scrollBy({ top: translated.top + translated.height * fraction - readingLine, behavior: 'instant' })
    }
  }

  top.addEventListener('click', event => {
    const button = event.target.closest('[data-language]')
    if (button) {
      setLanguage(button.dataset.language)
      top.querySelector(`[data-language="${language}"]`)?.focus({ preventScroll: true })
    } else if (event.target.closest('.chrome-skip')) {
      event.preventDefault()
      const main = document.getElementById('main')
      main?.focus({ preventScroll: true })
      main?.scrollIntoView({ block: 'start' })
    }
  })

  // The technical reports use plain links without a query. Carry the selected
  // language on those links too, including when storage is unavailable on disk.
  function localizeLinks() {
    for (const link of document.querySelectorAll('a[href*=".html"]')) {
      const url = new URL(link.href)
      if (url.origin !== location.origin) continue
      if (tinyRoot) {
        const folder = new URL(tinyRoot, location.href)
        if (!url.pathname.startsWith(folder.pathname)) continue
      } else if (!/\/(?:index|game|toolkit)(?:-slides)?\.html$/.test(url.pathname)) continue
      if (url.searchParams.get('lang') === language) continue
      url.searchParams.set('lang', language)
      link.href = url.href
    }
  }
  const preferred = savedLanguage()
  placeArticleLinks()
  if (technical) {
    const technicalNav = document.getElementById('chapter-select')?.closest('nav')
    if (technicalNav) {
      technicalNav.classList.add('case-report-contents')
      document.getElementById('overview')?.after(technicalNav)
    }
    const readerLanguage = isLanguage(technicalLanguage) ? technicalLanguage : preferred
    drawChrome(readerLanguage === 'zh' ? 'zh' : 'en')
  } else {
    drawChrome(document.documentElement.lang === 'zh-CN' ? 'zh' : 'en')
    if (!technicalLanguage && isLanguage(preferred) && preferred !== language) setLanguage(preferred)
  }
  localizeLinks()
  if (technical && !tinyRoot) document.title += ' — Junyan He'

  // The source reader may have followed a deep link before the site header
  // acquired its fonts and final size. Only finish the initial jump if the
  // visitor has not started interacting or restored a history position.
  if (location.hash && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward') {
    const initialHash = location.hash
    const cancel = new AbortController()
    for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
      window.addEventListener(type, () => cancel.abort(), { once: true, passive: true, signal: cancel.signal })
    }
    const align = async () => {
      await document.fonts.ready
      if (!cancel.signal.aborted && location.hash === initialHash && !document.querySelector('dialog[open]')) {
        document.getElementById(initialHash.slice(1))?.scrollIntoView({ block: 'start' })
      }
      cancel.abort()
    }
    if (document.readyState === 'complete') void align()
    else window.addEventListener('load', align, { once: true })
  }
})()
