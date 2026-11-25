import { useRef, useState } from 'react'
import type { ProjectId } from '../data/content'
import { assetUrl, previewBorderUrl, projectVisuals, type ProjectVisual } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'

type VideoProps = {
  src: string
  poster: string
  aspect: string
  title: string
  border?: ProjectVisual['previewBorder']
  muted?: boolean
  cues?: { seconds: number; label: string; thumbnail?: string }[]
}

export function StitchedVideo({ src, poster, aspect, title, border, muted = false, cues }: VideoProps) {
  const { t } = useSite()
  const yarnColor = border ?? 'blue'
  const videoRef = useRef<HTMLVideoElement>(null)
  const pendingSeek = useRef<number | null>(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  const play = async (seconds?: number) => {
    const video = videoRef.current
    if (!video) return
    if (seconds !== undefined) {
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) video.currentTime = seconds
      else pendingSeek.current = seconds
    }
    try {
      await video.play()
      if (seconds === undefined) video.focus({ preventScroll: true })
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setFailed(true)
    }
  }

  return <>
    <div className="project-demo" data-border={yarnColor} style={{ aspectRatio: aspect }}>
      <video
        ref={videoRef} src={src} poster={poster} aria-label={title}
        muted={muted} playsInline controls={started} preload="none" tabIndex={started ? 0 : -1}
        onLoadedMetadata={event => {
          if (pendingSeek.current !== null) {
            event.currentTarget.currentTime = pendingSeek.current
            pendingSeek.current = null
          }
        }}
        onPlay={() => { setStarted(true); setPlaying(true) }}
        onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />
      {border && <img className="project-preview-border" data-color={border} src={previewBorderUrl(border)} alt="" />}
      {failed ? <a className="project-demo-fallback" href={src}>{t('Open video', '打开视频')} ↗</a> :
        !playing && <button type="button" className="project-demo-play" onClick={() => void play()} aria-label={`${t('Play video', '播放视频')} — ${title}`}>
          <img className="yarn-disc" src={assetUrl(`borders/yarn-disc-${yarnColor}.png`)} alt="" draggable={false} />
          <img className="yarn-triangle" src={assetUrl(`borders/yarn-play-${yarnColor}.png`)} alt="" draggable={false} />
        </button>}
    </div>
    {cues && <div className="alice-video-cues" role="group" aria-label={t('Jump to a moment in the recording', '跳至录屏片段')}>
      {cues.map(cue => <button type="button" key={cue.seconds} onClick={() => void play(cue.seconds)}>
        {cue.thumbnail && <img src={cue.thumbnail} alt="" width="768" height="432" loading="lazy" />}
        <time>{Math.floor(cue.seconds / 60)}:{String(cue.seconds % 60).padStart(2, '0')}</time> {cue.label}
      </button>)}
    </div>}
  </>
}

export default function ProjectDemoVideo({ id, title }: { id: ProjectId; title: string }) {
  const { t } = useSite()
  const { demo, previewBorder } = projectVisuals[id]
  if (!demo) return <div className="report-video">{t('Demo video · coming soon', '演示视频 · 待补充')}</div>
  return <StitchedVideo key={demo.video} src={assetUrl(demo.video)} poster={assetUrl(demo.poster)}
    aspect={demo.aspect} border={previewBorder} title={`${title} — ${t('project demo', '项目演示')}`} muted />
}
