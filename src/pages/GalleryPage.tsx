import { useEffect, useRef, useState } from 'react'
import { copy, galleryItems, type GalleryItem } from '../data/content'
import { useSite } from '../lib/SiteContext'
import { CloseIcon, Flower } from '../components/Icons'

export default function GalleryPage() {
  const { language, t } = useSite()
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (selected) dialog.current?.showModal()
    else dialog.current?.close()
  }, [selected])
  useEffect(() => {
    if (!selected) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [selected])
  return (
    <div className="wrapper page-content gallery-page">
      <div className="page-heading">
        <h1>
          {t('Gallery', '画廊')}
          <em>.</em>
        </h1>
        <p>{t('Drawings, photographs & little observations.', '画画、拍照，和一点日常观察。')}</p>
      </div>
      {galleryItems.length ? (
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <button
              className="gallery-item"
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              aria-label={`${t('View', '查看')} ${copy(item.title, language)}`}
            >
              <img src={item.src} alt={copy(item.alt, language)} loading="lazy" />
              <span>
                {copy(item.title, language)}
                <small>{item.year}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <div className="gallery-empty-mark">
            <Flower />
            <span className="handwritten-note">a small collection</span>
          </div>
          <p>{t('Drawings and photographs, coming soon.', '画和照片，正在慢慢整理。')}</p>
        </div>
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={t('Artwork viewer', '作品查看器')}
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null)
        }}
      >
        <button
          className="lightbox-close"
          type="button"
          onClick={() => setSelected(null)}
          aria-label={t('Close artwork', '关闭作品')}
        >
          <CloseIcon />
        </button>
        {selected && (
          <figure>
            <img src={selected.src} alt={copy(selected.alt, language)} />
            <figcaption>
              {copy(selected.title, language)} {selected.year && <span> / {selected.year}</span>}
            </figcaption>
          </figure>
        )}
      </dialog>
    </div>
  )
}
