import { useEffect, useRef, useState } from 'react'
import {
  copy,
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from '../data/content'
import { useSite } from '../lib/SiteContext'
import { CloseIcon } from '../components/Icons'

export default function GalleryPage({ category }: { category: GalleryCategory }) {
  const { language, t } = useSite()
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const items = galleryItems.filter((item) => item.category === category)
  const categoryName = copy(galleryCategories.find((item) => item.id === category)!.label, language)
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
      <h1 className="visually-hidden">
        {t('Gallery', '画廊')} / {categoryName}
      </h1>
      {items.length ? (
        <div className="gallery-grid">
          {items.map((item) => (
            <button
              className="gallery-item"
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              aria-label={`${t('View', '查看')} ${copy(item.title, language)}`}
            >
              <img src={item.src} alt={copy(item.alt, language)} loading="lazy" />
              <span>{copy(item.title, language)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <p>{t('Works to be added.', '作品待整理。')}</p>
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
            <figcaption>{copy(selected.title, language)}</figcaption>
          </figure>
        )}
      </dialog>
    </div>
  )
}
