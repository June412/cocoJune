import { assetUrl } from '../../data/projectVisuals'
import { prepareAnatomy } from './anatomyRenderer'
import { prepareVolume } from './volumeRenderer'
import type { DrawFrame, MakeRenderer, OrbitView } from './orbitTypes'

export type Model = 'volume' | 'anatomy'
export type StageStatus = 'loading' | 'ready' | 'unavailable'

export function mountOrbitStage(host: HTMLElement, model: Model, initialView: OrbitView, status: (value: StageStatus) => void) {
  const lifetime = new AbortController()
  const signal = lifetime.signal
  const script = document.createElement('script') as HTMLScriptElement & { xrayData?: string[] }
  let canvas: HTMLCanvasElement | undefined
  let makeRenderer: MakeRenderer
  let draw: DrawFrame | undefined
  let software = false
  let view = initialView
  let generation = 0
  let frame = 0
  let settle = 0
  let interacting = false
  let ready = false

  function requestDraw(moving = false) {
    interacting = moving
    generation++
    window.clearTimeout(settle)
    if (signal.aborted || !draw) return
    if (moving) settle = window.setTimeout(() => requestDraw(), 160)
    if (frame) return
    frame = requestAnimationFrame(async () => {
      frame = 0
      const revision = generation
      const current = () => revision === generation && !signal.aborted
      if (!draw || !current()) return
      try {
        await draw(view, interacting, current)
        if (!ready && current()) {
          ready = true
          status('ready')
        }
      } catch {
        if (current()) recover()
      }
    })
  }

  function releaseCanvas() {
    if (!canvas) return
    const previous = canvas
    canvas = undefined
    draw = undefined
    if (!software) {
      const gl = model === 'volume' ? previous.getContext('webgl2') : previous.getContext('webgl')
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
    }
    previous.remove()
  }

  function unavailable() {
    generation++
    releaseCanvas()
    if (!signal.aborted) status('unavailable')
  }

  function install(useSoftware: boolean) {
    releaseCanvas()
    software = useSoftware
    const next = document.createElement('canvas')
    canvas = next
    next.setAttribute('aria-hidden', 'true')
    host.append(next)
    draw = makeRenderer(next, software)
    host.dataset.renderer = software ? 'canvas2d' : model === 'volume' ? 'webgl2' : 'webgl'
    if (!software) next.addEventListener('webglcontextlost', event => {
      event.preventDefault()
      if (canvas === next && !signal.aborted) recover()
    }, { once: true, signal })
    requestDraw()
  }

  function recover() {
    if (!software) {
      try {
        install(true)
        return
      } catch { /* Show the original Unity still when neither canvas path is available. */ }
    }
    unavailable()
  }

  // Hosting the packed bytes in a classic script also lets the local HTML export
  // load them from its sibling public/ folder without a file-URL fetch.
  script.src = assetUrl(`projects/xray/viewers/${model}-data.js`)
  script.onload = () => {
    script.remove()
    if (signal.aborted) return
    try {
      const packed = script.xrayData
      delete script.xrayData
      if (!packed) throw new Error('Missing model data')
      makeRenderer = model === 'volume' ? prepareVolume(packed) : prepareAnatomy(packed)
    } catch {
      unavailable()
      return
    }
    try {
      install(false)
    } catch {
      recover()
    }
  }
  script.onerror = () => {
    script.remove()
    unavailable()
  }

  const onResize = () => requestDraw()
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(onResize) : null
  if (resize) resize.observe(host)
  else window.addEventListener('resize', onResize, { signal })

  const near = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      near?.disconnect()
      if (!signal.aborted) document.head.append(script)
    }
  }, { rootMargin: '250px' }) : null
  if (near) near.observe(host)
  else document.head.append(script)

  return {
    update(next: OrbitView, moving: boolean) {
      view = next
      requestDraw(moving)
    },
    dispose() {
      lifetime.abort()
      generation++
      near?.disconnect()
      resize?.disconnect()
      window.clearTimeout(settle)
      cancelAnimationFrame(frame)
      script.onload = script.onerror = null
      script.remove()
      releaseCanvas()
    },
  }
}
