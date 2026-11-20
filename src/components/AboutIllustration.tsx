import type { ReactNode } from 'react'
import type { AboutLink } from '../data/aboutLinks'
import { assetUrl } from '../data/projectVisuals'

// Small original composition sketches, ready to replace with the author's drawings.
const sketches: Record<AboutLink['id'], ReactNode> = {
  games: <>
    <path d="M28 40C19 43 12 77 21 82C28 86 38 70 42 69L63 70C69 72 76 86 83 81C94 74 85 43 77 40C65 35 40 35 28 40Z" />
    <path d="M29 53L29 69M21 61L37 61M46 39C42 26 56 31 54 20M53 21C62 11 71 16 66 24C62 28 57 25 53 21" />
    <circle cx="70" cy="54" r="2.5" /><circle cx="79" cy="64" r="2.5" />
    <path d="M47 62Q53 67 59 62" />
  </>,
  github: <>
    <path d="M21 27L79 25L82 73L20 75ZM20 75L9 85C36 90 67 88 91 84L82 73M43 81L60 81" />
    <path d="M37 45L33 33L46 40M58 40L71 32L69 47C77 66 34 70 32 54C31 48 34 44 37 45ZM40 51L44 51M58 50L62 50M49 58Q53 62 57 57" />
  </>,
  cv: <>
    <path d="M26 14L64 12L81 30L79 86L22 88ZM64 12L63 31L81 30M33 49L67 47M32 58L65 57M32 68L54 67" />
    <circle cx="38" cy="31" r="5" /><path d="M30 42Q38 33 46 41M62 76L66 80L75 70" />
  </>,
  research: <>
    <path d="M49 28C38 20 21 23 13 29L15 79C28 73 38 75 50 82C62 72 77 74 88 77L87 26C72 21 60 22 49 28ZM49 28L50 82M23 39L39 37M24 50L39 48M24 62L40 61M61 45L76 42M61 57L77 55M67 24L67 38L73 34L79 37L79 24" />
    <path d="M39 13L37 7M51 10L53 4M61 15L66 10" />
  </>,
  gallery: <>
    <path d="M19 30L63 31L63 82L17 81ZM24 67L36 49L45 62L52 54L59 72M70 75L76 46L88 15L96 19L84 51L70 75ZM76 46L84 51M70 75L75 65" />
    <circle cx="48" cy="42" r="4" /><path d="M20 25L24 15L61 23M30 88L43 91" />
  </>,
  email: <>
    <path d="M13 36L87 32L88 80L16 84ZM13 36L51 60L87 32M17 80L38 59M86 78L65 57" />
    <path d="M42 20C35 7 24 20 42 31C60 18 49 8 42 20M67 16L71 10M78 24L85 22" />
  </>,
}

export default function AboutIllustration({ item }: { item: AboutLink }) {
  return <span className="about-illustration" aria-hidden="true">
    {item.illustration ? <img src={assetUrl(item.illustration)} alt="" loading="lazy" width="100" height="100" /> :
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{sketches[item.id]}</svg>}
  </span>
}
