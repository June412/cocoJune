import { cvUrl, email, github, type Localized } from './content'

export type AboutLinkId = 'games' | 'github' | 'cv' | 'research' | 'gallery' | 'email'
export type AboutLink = {
  id: AboutLinkId
  intro: Localized
  label: Localized
  href: string
  external?: boolean
  download?: string
  // Illustration paths are relative to public/; unset paths use the original sketch.
  illustration?: string
}

export const aboutLinks: AboutLink[] = [
  { id: 'games', illustration: 'illustrations/home-games-line-v1.png', intro: { en: 'Explore my little ', zh: '逛逛我的' }, label: { en: 'games & projects', zh: '游戏和项目' }, href: '#/projects' },
  { id: 'github', illustration: 'illustrations/home-github-line-v1.png', intro: { en: 'Find my code on ', zh: '代码放在' }, label: { en: 'GitHub', zh: 'GitHub' }, href: github, external: true },
  { id: 'cv', illustration: 'illustrations/home-cv-line-v1.png', intro: { en: 'Take a look at my ', zh: '这里有我的' }, label: { en: 'CV', zh: '简历 CV' }, href: cvUrl, download: 'Junyan_He_CV.pdf' },
  { id: 'research', illustration: 'illustrations/home-research-line-v1.png', intro: { en: 'Read my ', zh: '看看我的' }, label: { en: 'research & papers', zh: '研究与论文' }, href: '#/research' },
  { id: 'gallery', illustration: 'illustrations/home-gallery-line-v1.png', intro: { en: 'Some things I ', zh: '还有一些' }, label: { en: 'draw & photograph', zh: '绘画与照片' }, href: '#/gallery' },
  { id: 'email', illustration: 'illustrations/home-email-line-v1.png', intro: { en: 'Say hello at ', zh: '写信给我：' }, label: { en: email, zh: email }, href: `mailto:${email}` },
]
