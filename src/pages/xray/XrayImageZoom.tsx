import { createContext, useContext, useRef, useState, type PropsWithChildren, type ReactElement } from 'react'
import { useSite } from '../../lib/SiteContext'

type ZoomImage = { caption: string } & ({ src: string } | { graphic: ReactElement })
const ZoomContext = createContext<((image: ZoomImage) => void) | null>(null)

export function XrayImageZoomProvider({ children }: PropsWithChildren) {
  const { t } = useSite()
  const dialog = useRef<HTMLDialogElement>(null)
  const [image, setImage] = useState<ZoomImage | null>(null)

  function openImage(selected: ZoomImage) {
    setImage(selected)
    dialog.current?.showModal()
  }

  return <ZoomContext.Provider value={openImage}>
    {children}
    <dialog className="xray-lightbox" ref={dialog} aria-labelledby="xray-enlarged-caption"
      onClose={() => setImage(null)}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {image && <figure>
        <div className="xray-lightbox-actions">
          <button type="button" autoFocus onClick={() => dialog.current?.close()}>{t('Close', '关闭')}</button>
        </div>
        {'src' in image ? <img src={image.src} alt={image.caption} /> : image.graphic}
        <figcaption id="xray-enlarged-caption">{image.caption}</figcaption>
      </figure>}
    </dialog>
  </ZoomContext.Provider>
}

export function XrayZoomButton({ className, children, ...image }: PropsWithChildren<ZoomImage & { className?: string }>) {
  const open = useContext(ZoomContext)
  const { t } = useSite()
  return <button type="button" className={['xray-zoom-button', className].filter(Boolean).join(' ')}
    aria-haspopup="dialog" aria-label={t('Enlarge image', '放大图片') + ' · ' + image.caption}
    onClick={() => open?.(image)}>{children}</button>
}
