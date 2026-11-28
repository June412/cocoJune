import { useEffect, useRef, type CSSProperties } from 'react'
import { copy, type ProjectId } from '../data/content'
import { assetUrl, previewBorderUrl, projectVisuals } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'

export default function ProjectPreview({ id, title }: { id: ProjectId; title: string }) {
  const { language, t } = useSite()
  const visual = projectVisuals[id]
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPlayback = () => {
      if (motion.matches || visual.hoverPlay) video.pause()
      else void video.play().catch(() => { /* Native controls remain available. */ })
    }
    syncPlayback()
    motion.addEventListener('change', syncPlayback)
    return () => motion.removeEventListener('change', syncPlayback)
  }, [visual.video])

  const previewClasses = [
    'project-preview',
    visual.hoverPlay ? 'project-preview--hover-video' : '',
    visual.previewScale ? 'project-preview--scaled' : '',
  ].filter(Boolean).join(' ')
  const crop = visual.previewVideoCrop
  const previewStyle = visual.previewAspect || visual.previewScale || visual.previewBorderScale || crop || visual.previewVideoZoom
    ? ({
        aspectRatio: visual.previewAspect,
        '--preview-scale': visual.previewScale,
        '--preview-border-scale': visual.previewBorderScale,
        '--preview-video-zoom': visual.previewVideoZoom,
        '--preview-video-fit': visual.previewVideoFit,
        '--preview-video-crop-top': `${crop?.top ?? 0}%`,
        '--preview-video-crop-right': `${crop?.right ?? 0}%`,
        '--preview-video-crop-bottom': `${crop?.bottom ?? 0}%`,
        '--preview-video-crop-left': `${crop?.left ?? 0}%`,
      } as CSSProperties)
    : undefined

  return (
    <div
      className={previewClasses}
      style={previewStyle}
      onMouseEnter={visual.hoverPlay ? () => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) void videoRef.current?.play().catch(() => {})
      } : undefined}
      onMouseLeave={visual.hoverPlay ? () => {
        const video = videoRef.current
        if (!video) return
        video.pause()
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.currentTime > 0) video.currentTime = 0
      } : undefined}
    >
      <div className="project-preview-media">
        {visual.video ? (
          <video
            ref={videoRef}
            src={assetUrl(visual.video)}
            poster={visual.cover ? assetUrl(visual.cover) : undefined}
            aria-label={`${title} — ${t('gameplay preview', '项目录屏')}`}
            muted
            loop
            playsInline
            controls={!visual.hoverPlay}
            tabIndex={visual.hoverPlay ? -1 : 0}
            aria-hidden={visual.hoverPlay ? true : undefined}
            preload={visual.hoverPlay && visual.cover ? 'none' : 'metadata'}
            width="960"
            height="600"
          />
        ) : visual.cover ? (
          <img src={assetUrl(visual.cover)} alt={copy(visual.coverAlt, language)} loading="lazy" width="960" height="600" />
        ) : (
          <div className="project-preview-placeholder" role="img" aria-label={`${title} — ${t('recording to be added', '录屏待补充')}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M9 5.5 19 12 9 18.5Z" strokeLinejoin="round" />
            </svg>
            <span>{t('Recording to come', '录屏待补充')}</span>
          </div>
        )}
      </div>
      {visual.video && visual.previewBorder && (
        <img
          className="project-preview-border"
          data-color={visual.previewBorder}
          src={previewBorderUrl(visual.previewBorder)}
          alt=""
          aria-hidden="true"
        />
      )}
    </div>
  )
}
