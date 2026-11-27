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
          'Turn a body sideways and ribs that were separate in a front view begin to overlap. This Unity project recreates that change from a CT scan or a 3D anatomy model. For each pixel, it follows a ray through the body and calculates the fraction of the beam that reaches the detector.',
          '把人体从正面转到侧面，原本分开的肋骨就会在投影里叠到一起。这个 Unity 项目用 CT 数据或三维解剖模型重现这个过程：对图像上的每个像素，追踪一条穿过身体的 X 射线，算出有多少射线抵达探测器。',
        )}</p>
      </ProjectOpening>
      <div className="report-transcript coursework-prose xray-prose">
        <section className="xray-contributions" aria-labelledby="xray-role">
          <h2 id="xray-role" data-thread-chapter>{t('My role', '我的职责')}</h2>
          <p>{t(
            'I wrote the HLSL compute shader that integrates attenuation along each ray, and built the Unity tools for importing DICOM slices, positioning the detector and exporting the resulting images and raw values. I checked the GPU output against a CPU reference and test objects with known thicknesses.',
            '我写了沿射线累积材料衰减的 HLSL 计算着色器，也在 Unity 里做了从导入 DICOM 切片、调整投影几何，到导出图像和原始数值的一套工具。我用 CPU 参考计算和厚度已知的测试体模，逐项核对 GPU 的输出。',
          )}</p>
          <p>{t(
            'One detail took me back to the anatomy. My first long bones looked solid from edge to edge. I gave them a dense outer shell and a less dense core, so the bright rim follows the bone as the view turns.',
            '早期的长骨从边缘到中央都是一片实白。对照影像后，我把骨骼改为致密外壳和低密度内芯，让亮边随着视角沿骨缘移动。',
          )}</p>
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
