import { useState, type KeyboardEvent } from 'react'
import ProjectOpening from '../components/ProjectOpening'
import { useSite } from '../lib/SiteContext'
import { XrayImageZoomProvider } from './xray/XrayImageZoom'
import { XrayAnatomyViewer, XrayVolumeViewer } from './xray/XrayViewers'
import { XrayFilm, XrayShowcase } from './xray/XrayShowcase'
import { XrayFindings, XrayProcess } from './xray/XrayStory'
import './xray/xray-page.css'

const projectHref = '#/projects/x-ray'
function focusChapter(id: string) {
  const chapter = document.getElementById(id)
  if (!chapter) return
  const heading = chapter.matches('h1, h2, h3') ? chapter : chapter.querySelector<HTMLElement>('h1, h2, h3') ?? chapter
  heading.setAttribute('tabindex', '-1')
  heading.focus({ preventScroll: true })
  heading.scrollIntoView({ block: 'start' })
}

const models = [
  { id: 'volume', en: 'X-ray projection', zh: 'X 光投影', Viewer: XrayVolumeViewer },
  { id: 'anatomy', en: 'Skin & skeleton', zh: '体表与骨架', Viewer: XrayAnatomyViewer },
] as const

function XrayModels() {
  const { t } = useSite()
  const [active, setActive] = useState(0)
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const next = { ArrowLeft: 1 - active, ArrowRight: 1 - active, Home: 0, End: 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    document.getElementById('xray-tab-' + models[next].id)?.focus()
  }
  return <section id="xray-models" data-thread-chapter className="xray-models" aria-labelledby="xray-models-heading">
    <h2 id="xray-models-heading">{t('Anatomy models', '解剖模型')}</h2>
    <p>{t(
      'Start with the ribs in a front view, then turn the body sideways to see them overlap. Switch to the surface model to find the same bones beneath the skin.',
      '先从正面看肋骨，再把人体转到侧面，观察肋骨和脊柱怎样叠在一起。切换到「体表与骨架」，可以找到这些骨头在皮肤下面的位置。',
    )}</p>
    <div className="xray-model-tabs" role="tablist" aria-label={t('Model view', '模型视图')}>
      {models.map(({ id, en, zh }, i) => <button key={id} id={'xray-tab-' + id} type="button" role="tab"
        aria-selected={active === i} aria-controls={'xray-panel-' + id} tabIndex={active === i ? 0 : -1}
        onClick={() => setActive(i)} onKeyDown={onTabKey}>{t(en, zh)}</button>)}
    </div>
    {models.map(({ id, Viewer }, i) => <div key={id} id={'xray-panel-' + id} role="tabpanel"
      aria-labelledby={'xray-tab-' + id} hidden={active !== i}><Viewer /></div>)}
  </section>
}

export default function XrayPage() {
  const { t } = useSite()
  return <XrayImageZoomProvider>
    <article className="graphics-report xray-page">
      <a className="eyebrow" href="#/projects/category/tools">← {t('Graphics & tools', '图形与工具')}</a>
      <ProjectOpening id="xray-overview" project="x-ray" title="Volumetric X-ray" film={<XrayFilm />}>
        <p className="xray-intro">{t(
          'A Unity renderer turns CT slices or an anatomical mesh into an X-ray projection. Rotate the body to see the ribs overlap, or change the exposure to compare the grain.',
          '这个 Unity 渲染器把 CT 切片或解剖网格转成 X 光投影。旋转人体可以观察肋骨重叠，改变曝光可以比较图像颗粒。',
        )}</p>
      </ProjectOpening>
      <div className="report-transcript coursework-prose xray-prose">
        <section className="xray-contributions" aria-labelledby="xray-role">
          <h2 id="xray-role" data-thread-chapter>{t('My role', '我的职责')}</h2>
          <ul>
            <li><strong>{t('Rendering', '渲染')}</strong> · {t('Wrote the HLSL compute shader for ray integration and modelled the dense shell around long bones.', '编写沿射线积分的 HLSL 计算着色器，为长骨建立致密外壳与低密度内芯。')}</li>
            <li><strong>{t('Unity tools', 'Unity 工具')}</strong> · {t('Built DICOM import, detector positioning and image and raw-data export.', '实现 DICOM 导入、探测器定位和图像与原始数据导出。')}</li>
            <li><strong>{t('Verification', '验证')}</strong> · {t('Checked GPU output against CPU calculations and objects of known thickness.', '用 CPU 参考计算和已知厚度的体模核对 GPU 输出。')}</li>
          </ul>
        </section>
        <XrayModels />
        <XrayProcess />
        <XrayShowcase />
        <XrayFindings />
        <nav className="xray-reading-links" aria-label={t('Continue browsing', '继续浏览')}>
          <a href={projectHref + '#xray-overview'}
            onClick={() => { if (window.location.hash === projectHref + '#xray-overview') focusChapter('xray-overview') }}>
            {t('Back to project overview', '返回项目开头')}
          </a>
          <a href="#/projects/category/tools">{t('All graphics & tools', '查看图形与工具项目')}</a>
        </nav>
      </div>
    </article>
  </XrayImageZoomProvider>
}
