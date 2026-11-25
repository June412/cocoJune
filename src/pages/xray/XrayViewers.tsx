import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { assetUrl } from '../../data/projectVisuals'
import { useSite } from '../../lib/SiteContext'
import { mountOrbitStage, type Model, type StageStatus } from './orbitStage'
import type { OrbitView, Region } from './orbitTypes'
import './xray-viewers.css'

const home: OrbitView = { yaw: 0, pitch: 0, region: 'whole', opacity: 24 }
const regions: [Region, string, string][] = [
  ['whole', 'Full body', '全身'], ['torso', 'Chest', '胸廓'], ['legs', 'Legs', '腿部'],
]
const directions: [number, string, string][] = [
  [0, 'Front', '正位'], [45, 'Oblique', '斜位'], [90, 'Side', '侧位'],
]

function OrbitViewer({ model }: { model: Model }) {
  const { t } = useSite()
  const volume = model === 'volume'
  const host = useRef<HTMLDivElement>(null)
  const engine = useRef<ReturnType<typeof mountOrbitStage> | null>(null)
  const [view, setView] = useState(home)
  const viewRef = useRef(home)
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null)
  const [status, setStatus] = useState<StageStatus>('loading')
  const help = useId()
  const range = useId()
  const title = volume ? t('X-ray projection', 'X 光投影') : t('Transparent anatomical model', '透明人体模型')

  useEffect(() => {
    if (!host.current) return
    const stage = mountOrbitStage(host.current, model, viewRef.current, setStatus)
    engine.current = stage
    return () => {
      engine.current = null
      stage.dispose()
    }
  }, [model])

  function change(values: Partial<OrbitView>, moving = false) {
    const next = { ...viewRef.current, ...values }
    viewRef.current = next
    setView(next)
    engine.current?.update(next, moving)
  }

  function turn(horizontal: number, vertical: number) {
    const current = viewRef.current
    const limit = volume ? 70 : 64
    change({
      yaw: ((current.yaw + horizontal + 180) % 360 + 360) % 360 - 180,
      pitch: Math.max(-limit, Math.min(limit, current.pitch + vertical)),
    }, true)
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (status !== 'ready' || pointer.current || event.button !== 0) return
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.focus({ preventScroll: true })
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const previous = pointer.current
    if (!previous || previous.id !== event.pointerId) return
    const box = event.currentTarget.getBoundingClientRect()
    turn((event.clientX - previous.x) * 225 / box.width, (event.clientY - previous.y) * 130 / box.height)
    previous.x = event.clientX
    previous.y = event.clientY
  }

  function stop(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current?.id !== event.pointerId) return
    pointer.current = null
    engine.current?.update(viewRef.current, false)
  }

  function keydown(event: KeyboardEvent<HTMLDivElement>) {
    if (status !== 'ready') return
    const step = volume ? 5 : 10
    switch (event.key) {
      case 'ArrowLeft': turn(-step, 0); break
      case 'ArrowRight': turn(step, 0); break
      case 'ArrowUp': turn(0, -step); break
      case 'ArrowDown': turn(0, step); break
      case 'Home': change(home); break
      default: return
    }
    event.preventDefault()
  }

  return <div className="xray-orbit" data-model={model} data-status={status}>
    <div className="xray-orbit-picture" tabIndex={status === 'ready' ? 0 : -1}
      role="group" aria-label={title} aria-describedby={help}
      onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop}
      onLostPointerCapture={stop} onKeyDown={keydown}>
      {status !== 'ready' && <img className="xray-orbit-poster"
        src={assetUrl(`projects/xray/viewers/${volume ? 'projection-front.png' : 'anatomy-front.png'}`)}
        alt={volume ? t('Frontal X-ray projection from Unity', 'Unity 正位 X 光投影') : t('Frontal view of the skeleton beneath transparent skin', '透明体表下的骨架正面图')} />}
      <div ref={host} className="xray-orbit-canvas" />
    </div>
    <div className="xray-orbit-settings">
      <p id={help} className="xray-orbit-help" role="status">{status === 'unavailable'
        ? t('Showing the front view. The interactive model is unavailable here.', '当前显示正位静帧，此浏览器无法打开交互模型。')
        : status === 'loading' ? t('Loading model…', '正在加载模型…')
          : t('Drag or use the arrow keys to rotate. Press Home to reset.', '拖动或按方向键旋转，Home 键复位。')}</p>
      <fieldset disabled={status !== 'ready'} className="xray-orbit-controls">
        <legend className="visually-hidden">{title}</legend>
        <div className="xray-orbit-field" role="group" aria-label={t('Angle', '投影方向')}>
          <span className="xray-orbit-label">{t('Angle', '视角')}</span>
          <div className="xray-orbit-choices">{directions.filter(([yaw]) => volume || yaw !== 45).map(([yaw, en, zh]) =>
            <button type="button" key={yaw} aria-pressed={Math.abs(view.yaw - yaw) < .1 && Math.abs(view.pitch) < .1}
              onClick={() => change({ yaw, pitch: 0 })}>{t(en, zh)}</button>)}</div>
        </div>
        <div className="xray-orbit-field" role="group" aria-label={t('Region', '观察范围')}>
          <span className="xray-orbit-label">{t('Region', '范围')}</span>
          <div className="xray-orbit-choices">{regions.filter(([id]) => volume || id !== 'legs').map(([id, en, zh]) =>
            <button type="button" key={id} aria-pressed={view.region === id}
              onClick={() => change({ region: id })}>{t(en, zh)}</button>)}</div>
        </div>
        {!volume && <div className="xray-orbit-field xray-orbit-opacity">
          <label htmlFor={range}>{t('Skin opacity', '体表不透明度')} <output htmlFor={range}>{view.opacity}%</output></label>
          <input id={range} type="range" min="0" max="100" step="1" value={view.opacity}
            onChange={event => change({ opacity: Number(event.target.value) }, true)} />
        </div>}
        <div className="xray-orbit-footer"><output aria-live="off">
          {t('Yaw', '方位')} {Math.round(view.yaw)}° · {t('Pitch', '俯仰')} {Math.round(view.pitch)}°
        </output><button type="button" onClick={() => change(home)}>{t('Reset view', '复位')}</button></div>
      </fieldset>
    </div>
  </div>
}

export function XrayVolumeViewer() { return <OrbitViewer model="volume" /> }
export function XrayAnatomyViewer() { return <OrbitViewer model="anatomy" /> }
