import type { GalleryItem } from './content'

const item = (
  id: string, src: string, width: number, height: number,
  title: string, titleZh: string, alt: string, altZh: string,
  category: GalleryItem['category'], layout: GalleryItem['layout'] = 'regular',
): GalleryItem => ({
  id,
  src,
  width,
  height,
  title: { en: title, zh: titleZh },
  alt: { en: alt, zh: altZh },
  category,
  layout,
})

export const galleryItems: GalleryItem[] = [
  item('character-design-01', 'drawings/character-design/01.webp', 2400, 1754, 'Character design 01', '角色设计 01', 'Character design drawing 1', '角色设计作品 1', 'character-design', 'featured'),
  item('character-design-02', 'drawings/character-design/02.webp', 2400, 1941, 'Character design 02', '角色设计 02', 'Character design drawing 2', '角色设计作品 2', 'character-design', 'large'),
  item('character-design-03', 'drawings/character-design/03.webp', 1506, 2156, 'Character design 03', '角色设计 03', 'Character design drawing 3', '角色设计作品 3', 'character-design', 'regular'),
  item('character-design-04', 'drawings/character-design/04.webp', 1353, 2400, 'Character design 04', '角色设计 04', 'Character design drawing 4', '角色设计作品 4', 'character-design', 'regular'),
  item('character-design-05', 'drawings/character-design/05.webp', 1810, 2400, 'Character design 05', '角色设计 05', 'Character design drawing 5', '角色设计作品 5', 'character-design', 'compact'),
  item('illustration-front-04', 'drawings/illustrations/front/10.webp', 1600, 2400, 'Illustration 01', '插画 01', 'Character illustration 1', '角色插画 1', 'illustrations', 'featured'),
  item('illustration-front-01', 'drawings/illustrations/front/02.webp', 2400, 2400, 'Illustration 02', '插画 02', 'Character illustration 2', '角色插画 2', 'illustrations', 'regular'),
  item('illustration-front-02', 'drawings/illustrations/front/11.webp', 2400, 1676, 'Illustration 03', '插画 03', 'Character illustration 3', '角色插画 3', 'illustrations', 'regular'),
  item('illustration-front-03', 'drawings/illustrations/front/04.webp', 2175, 2400, 'Illustration 04', '插画 04', 'Character illustration 4', '角色插画 4', 'illustrations', 'large'),
  item('illustration-front-05', 'drawings/illustrations/front/09.webp', 2400, 2400, 'Illustration 05', '插画 05', 'Character illustration 5', '角色插画 5', 'illustrations', 'regular'),
  item('illustration-front-06', 'drawings/illustrations/front/05.webp', 2048, 2048, 'Illustration 06', '插画 06', 'Character illustration 6', '角色插画 6', 'illustrations', 'large'),
  item('illustration-front-07', 'drawings/illustrations/front/08.webp', 2400, 1624, 'Illustration 07', '插画 07', 'Character illustration 7', '角色插画 7', 'illustrations', 'featured'),
  item('illustration-front-08', 'drawings/illustrations/front/01.webp', 2400, 2400, 'Illustration 08', '插画 08', 'Character illustration 8', '角色插画 8', 'illustrations', 'regular'),
  item('illustration-front-09', 'drawings/illustrations/front/07.webp', 1500, 1500, 'Illustration 09', '插画 09', 'Character illustration 9', '角色插画 9', 'illustrations', 'large'),
  item('illustration-front-10', 'drawings/illustrations/front/03.webp', 1800, 2400, 'Illustration 10', '插画 10', 'Character illustration 10', '角色插画 10', 'illustrations', 'compact'),
  item('illustration-front-11', 'drawings/illustrations/front/06.webp', 1500, 1500, 'Illustration 11', '插画 11', 'Character illustration 11', '角色插画 11', 'illustrations', 'regular'),
  item('illustration-middle-01', 'drawings/illustrations/middle/17.webp', 2048, 2048, 'Illustration 01', '插画 01', 'Character illustration 1', '角色插画 1', 'illustrations', 'regular'),
  item('illustration-middle-02', 'drawings/illustrations/middle/12.webp', 2400, 2400, 'Illustration 02', '插画 02', 'Character illustration 2', '角色插画 2', 'illustrations', 'large'),
  item('illustration-middle-03', 'drawings/illustrations/middle/14.webp', 1500, 1500, 'Illustration 03', '插画 03', 'Character illustration 3', '角色插画 3', 'illustrations', 'regular'),
  item('illustration-middle-04', 'drawings/illustrations/middle/21.webp', 2400, 1199, 'Illustration 04', '插画 04', 'Character illustration 4', '角色插画 4', 'illustrations', 'compact'),
  item('illustration-middle-05', 'drawings/illustrations/middle/11.webp', 2048, 2048, 'Illustration 05', '插画 05', 'Character illustration 5', '角色插画 5', 'illustrations', 'large'),
  item('illustration-middle-06', 'drawings/illustrations/middle/16.webp', 2000, 2000, 'Illustration 06', '插画 06', 'Character illustration 6', '角色插画 6', 'illustrations', 'regular'),
  item('illustration-middle-07', 'drawings/illustrations/middle/13.webp', 1500, 1500, 'Illustration 07', '插画 07', 'Character illustration 7', '角色插画 7', 'illustrations', 'regular'),
  item('illustration-middle-08', 'drawings/illustrations/middle/15.webp', 2393, 2400, 'Illustration 08', '插画 08', 'Character illustration 8', '角色插画 8', 'illustrations', 'regular'),
  item('illustration-middle-09', 'drawings/illustrations/middle/07.webp', 2048, 2048, 'Illustration 09', '插画 09', 'Character illustration 9', '角色插画 9', 'illustrations', 'regular'),
  item('illustration-middle-10', 'drawings/illustrations/middle/01.webp', 2400, 2400, 'Illustration 10', '插画 10', 'Character illustration 10', '角色插画 10', 'illustrations', 'large'),
  item('illustration-middle-11', 'drawings/illustrations/middle/18.webp', 1801, 2400, 'Illustration 11', '插画 11', 'Character illustration 11', '角色插画 11', 'illustrations', 'regular'),
  item('illustration-middle-12', 'drawings/illustrations/middle/04.webp', 2400, 2400, 'Illustration 12', '插画 12', 'Character illustration 12', '角色插画 12', 'illustrations', 'regular'),
  item('illustration-middle-13', 'drawings/illustrations/middle/22.webp', 2400, 2400, 'Illustration 13', '插画 13', 'Character illustration 13', '角色插画 13', 'illustrations', 'regular'),
  item('illustration-middle-14', 'drawings/illustrations/middle/02.webp', 1962, 1715, 'Illustration 14', '插画 14', 'Character illustration 14', '角色插画 14', 'illustrations', 'compact'),
  item('illustration-middle-15', 'drawings/illustrations/middle/03.webp', 2400, 2400, 'Illustration 15', '插画 15', 'Character illustration 15', '角色插画 15', 'illustrations', 'regular'),
  item('illustration-middle-16', 'drawings/illustrations/middle/20.webp', 1800, 2400, 'Illustration 16', '插画 16', 'Character illustration 16', '角色插画 16', 'illustrations', 'large'),
  item('illustration-middle-17', 'drawings/illustrations/middle/19.webp', 2400, 2400, 'Illustration 17', '插画 17', 'Character illustration 17', '角色插画 17', 'illustrations', 'regular'),
  item('illustration-middle-18', 'drawings/illustrations/middle/05.webp', 2400, 2400, 'Illustration 18', '插画 18', 'Character illustration 18', '角色插画 18', 'illustrations', 'regular'),
  item('illustration-middle-19', 'drawings/illustrations/middle/08.webp', 2400, 2400, 'Illustration 19', '插画 19', 'Character illustration 19', '角色插画 19', 'illustrations', 'compact'),
  item('illustration-middle-20', 'drawings/illustrations/middle/06.webp', 2048, 2048, 'Illustration 20', '插画 20', 'Character illustration 20', '角色插画 20', 'illustrations', 'large'),
  item('illustration-middle-21', 'drawings/illustrations/middle/10.webp', 2400, 2400, 'Illustration 21', '插画 21', 'Character illustration 21', '角色插画 21', 'illustrations', 'regular'),
  item('illustration-middle-22', 'drawings/illustrations/middle/09.webp', 2400, 2400, 'Illustration 22', '插画 22', 'Character illustration 22', '角色插画 22', 'illustrations', 'regular'),
  item('illustration-back-01', 'drawings/illustrations/back/02.webp', 2400, 2400, 'Illustration 01', '插画 01', 'Character illustration 1', '角色插画 1', 'illustrations', 'large'),
  item('illustration-back-02', 'drawings/illustrations/back/04.webp', 2400, 2400, 'Illustration 02', '插画 02', 'Character illustration 2', '角色插画 2', 'illustrations', 'regular'),
  item('illustration-back-03', 'drawings/illustrations/back/03.webp', 1800, 2400, 'Illustration 03', '插画 03', 'Character illustration 3', '角色插画 3', 'illustrations', 'regular'),
  item('illustration-back-04', 'drawings/illustrations/back/05.webp', 2400, 2400, 'Illustration 04', '插画 04', 'Character illustration 4', '角色插画 4', 'illustrations', 'compact'),
  item('illustration-back-05', 'drawings/illustrations/back/01.webp', 2400, 2400, 'Illustration 05', '插画 05', 'Character illustration 5', '角色插画 5', 'illustrations', 'regular'),
  item('illustration-back-06', 'drawings/illustrations/back/06.webp', 2400, 2248, 'Illustration 06', '插画 06', 'Character illustration 6', '角色插画 6', 'illustrations', 'regular'),
  item('on-paper-01', 'drawings/on-paper/01.webp', 1801, 2400, 'Illustration 40', '插画 40', 'Hand-drawn work 1', '手绘作品 1', 'illustrations', 'large'),
  item('on-paper-02', 'drawings/on-paper/02.webp', 2400, 1800, 'Illustration 41', '插画 41', 'Hand-drawn work 2', '手绘作品 2', 'illustrations', 'large'),
  item('on-paper-03', 'drawings/on-paper/03.webp', 2400, 2400, 'Illustration 42', '插画 42', 'Hand-drawn work 3', '手绘作品 3', 'illustrations', 'regular'),
]

// Reading order for All, independent of the category pages.
const allGalleryOrder = [
  'illustration-front-03', 'on-paper-03', 'illustration-front-04',
  'illustration-front-02', 'illustration-front-06', 'illustration-middle-11',
  'illustration-middle-10', 'illustration-middle-22', 'character-design-01',
  'illustration-front-08', 'illustration-middle-03',

  'illustration-front-09', 'illustration-front-01', 'illustration-front-11',
  'character-design-03', 'character-design-05', 'illustration-middle-06',
  'character-design-02', 'illustration-back-03', 'illustration-front-07',
  'illustration-front-10', 'illustration-middle-02', 'illustration-middle-14',
  'illustration-middle-19', 'illustration-back-02', 'illustration-back-01',
  'illustration-back-05', 'illustration-middle-21', 'illustration-middle-07',
  'illustration-middle-12', 'illustration-middle-05', 'illustration-middle-16',
  'illustration-middle-13', 'illustration-middle-04', 'illustration-back-04',
  'illustration-middle-15', 'illustration-back-06', 'illustration-middle-09',
  'on-paper-02', 'illustration-middle-01', 'on-paper-01',
  'illustration-middle-20', 'illustration-middle-18', 'illustration-front-05',
  'illustration-middle-17',

  'illustration-middle-08', 'character-design-04',
]

const allRanks = new Map(allGalleryOrder.map((id, index) => [id, index]))
export const allGalleryItems = [...galleryItems].sort((a, b) =>
  (allRanks.get(a.id) ?? allGalleryOrder.length) - (allRanks.get(b.id) ?? allGalleryOrder.length),
)
