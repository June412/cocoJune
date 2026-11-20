import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  copy,
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from '../data/content'
import { useSite } from '../lib/SiteContext'
import { CloseIcon } from '../components/Icons'
import { assetUrl } from '../data/projectVisuals'

const allPriorityIds = [
  'illustration-front-03', // IMG_2784.pdf
  'on-paper-01', // FullSizeRender 2.pdf
  'illustration-front-04', // IMG_4043.PNG
  'illustration-front-02', // IMG_4861.PNG
  'illustration-front-06', // IMG_3277.JPG
  'illustration-middle-11', // IMG_4850.PNG
  'illustration-middle-10', // IMG_1867.JPG
  'illustration-middle-22', // IMG_3269.PNG
  'character-design-01', // 角色设计/1.PNG
]

export default function GalleryPage({ category }: { category: GalleryCategory }) {
  const { language, t } = useSite()
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const allItems = useMemo(() => {
    const priorityItems = allPriorityIds
      .map((id) => galleryItems.find((item) => item.id === id))
      .filter((item): item is GalleryItem => Boolean(item))
    const priorityIds = new Set(priorityItems.map((item) => item.id))
    const items = galleryItems.filter((item) => !priorityIds.has(item.id))
    let seed = 20261120
    for (let index = items.length - 1; index > 0; index -= 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const target = seed % (index + 1)
      const current = items[index]
      items[index] = items[target]
      items[target] = current
    }
    return [...priorityItems, ...items]
  }, [])
  const items = category === 'all' ? allItems : galleryItems.filter((item) => item.category === category)
  const categoryName = copy(galleryCategories.find((item) => item.id === category)!.label, language)
  const dialog = useRef<HTMLDialogElement>(null)
  const gallery = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const grid = gallery.current
    if (category !== 'all' || !grid) return

    const tiles = Array.from(grid.querySelectorAll<HTMLButtonElement>('.gallery-item'))
    const layout = () => {
      const rowHeight = parseFloat(getComputedStyle(grid).gridAutoRows)
      const gap = parseFloat(getComputedStyle(tiles[0]).marginBottom)
      const spans = tiles.map((tile) => Math.ceil((tile.getBoundingClientRect().height + gap) / rowHeight))
      tiles.forEach((tile, index) => { tile.style.gridRowEnd = `span ${spans[index]}` })
    }
    // Size the grid tracks before paint. Grid auto-placement then fills the shortest column in reading order.
    layout()
    const observer = new ResizeObserver(layout)
    tiles.forEach((tile) => observer.observe(tile))
    return () => observer.disconnect()
  }, [category])
  const renderItems = (itemsToRender: GalleryItem[]) => itemsToRender.map((item) => (
    <button
      className={`gallery-item gallery-item--${item.layout}`}
      key={item.id}
      type="button"
      onClick={() => setSelected(item)}
      aria-label={`${t('View', '查看')} ${copy(item.title, language)}`}
    >
      <img src={assetUrl(item.src)} alt={copy(item.alt, language)} width={item.width} height={item.height} loading="lazy" decoding="async" />
    </button>
  ))
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
        <div ref={gallery} className={`gallery-grid gallery-grid--${category}`}>{renderItems(items)}</div>
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
            <img src={assetUrl(selected.src)} alt={copy(selected.alt, language)} />
            <figcaption>{copy(selected.title, language)}</figcaption>
          </figure>
        )}
      </dialog>
    </div>
  )
}
