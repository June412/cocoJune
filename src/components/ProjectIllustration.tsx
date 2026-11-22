import type { ReactNode } from 'react'
import { copy, type ProjectId } from '../data/content'
import { assetUrl, projectVisuals } from '../data/projectVisuals'
import { useSite } from '../lib/SiteContext'

// Original, deliberately small layout sketches. Replace through projectVisuals
// with Junyan's own transparent drawings when those are ready.
const sketches: Partial<Record<ProjectId, ReactNode>> = {
  tinyroomies: (
    <>
      <path d="M47 53C26 38 40 19 54 37M84 38C95 16 112 32 98 53" />
      <path d="M45 50C52 34 79 31 94 48C108 63 103 85 91 94L96 116C81 129 49 128 35 118L44 89C32 76 34 60 45 50Z" />
      <path d="M47 119L42 137L30 136M83 123L90 137L103 136M40 101L26 93L30 80M95 102L120 96" />
      <path className="sketch-detail" d="M94 72L134 77L131 88L91 82ZM98 85L95 113M126 89L126 112M103 73L107 51L135 55L134 76M111 58L129 60" />
      <path d="M60 72Q67 80 74 72M31 111C17 112 16 125 28 127" />
      <circle cx="56" cy="60" r="2" fill="currentColor" stroke="none" />
      <circle cx="79" cy="59" r="2" fill="currentColor" stroke="none" />
      <path d="M23 144Q62 147 108 143" strokeWidth="1" />
    </>
  ),
  alice: (
    <>
      <path d="M51 56C37 33 39 12 49 14C59 16 62 35 63 48M76 48C78 22 86 10 93 17C103 28 90 46 87 54" />
      <path d="M45 58C57 43 80 42 93 55C107 70 98 90 88 94L101 122C93 135 52 139 39 124L48 94C31 84 33 69 45 58Z" />
      <path d="M41 103L27 114L33 121L44 118M96 102L112 113L107 122L99 119M50 132L44 143L63 143L67 136M81 135L84 143L101 142L93 131" />
      <path d="M58 72L65 79M65 72L58 79M73 86L78 86M79 107L91 105L93 118L80 121ZM82 103L82 109M88 103L89 108M91 112L96 111M84 118L85 123" />
      <circle cx="84" cy="73" r="2" fill="currentColor" stroke="none" />
      <path className="sketch-detail" d="M94 118C111 119 115 142 131 134C143 129 136 115 125 120M130 120L140 101" />
    </>
  ),
  'between-sips': (
    <>
      <path d="M27 80Q49 75 82 80L80 108C77 129 37 128 31 109ZM83 86C108 78 107 109 81 110M21 127Q57 137 92 127" />
      <path className="sketch-detail" d="M43 67C29 56 50 51 41 40M62 67C49 55 70 49 61 36" />
      <path d="M104 89C101 69 111 53 123 57C134 60 131 76 136 81L146 87L134 90C131 104 117 110 104 104L96 110L98 94Z" />
      <path d="M110 83Q112 98 125 92M112 106L110 121L104 123M123 106L124 120L130 120M132 71L143 76L132 79" />
      <circle cx="123" cy="69" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  'textile-toolkit': (
    <>
      <path d="M29 102C29 80 39 71 49 79C59 87 56 103 66 107L129 111C142 117 131 132 114 133L39 133C20 131 15 116 29 102Z" />
      <path d="M34 80L29 63M48 79L53 60M32 109Q40 114 47 107" />
      <circle cx="29" cy="60" r="3" />
      <circle cx="54" cy="57" r="3" />
      <path className="sketch-detail" d="M69 50C79 43 112 43 124 49L123 58L117 62L119 98L128 103L126 112C112 118 80 115 70 110L70 101L77 97L76 63L68 58ZM77 63Q99 69 117 62M78 72Q99 77 117 71M78 81Q99 86 117 80M78 90Q99 95 119 88M77 97Q98 104 119 98" />
      <path d="M119 104C144 91 150 113 145 131" strokeDasharray="2 5" />
    </>
  ),
  'perspective-freeze': (
    <>
      <path d="M84 38L111 29L135 46L111 58ZM84 38L85 67L111 84L135 72L135 46M111 58L111 84" />
      <path className="sketch-detail" d="M68 22L57 23L54 37M142 30L150 35L148 48M65 78L61 89L75 95M139 89L145 82L149 68" />
      <path d="M32 85C16 77 22 59 36 61C52 62 52 82 39 88M35 90L44 117L33 140M43 115L59 130L66 129M36 95L55 84L63 63M29 96L18 109" />
      <path d="M48 67L80 58" strokeDasharray="2 6" />
      <circle cx="39" cy="73" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),
  'x-ray': (
    <>
      <path d="M33 55L74 36L121 58L79 78ZM33 55L35 110L79 132L121 111L121 58M79 78L79 132" />
      <path className="sketch-detail" d="M53 61L78 49L104 62L79 75ZM54 73L79 87L104 74M55 87L79 101L104 87M55 101L79 115L104 101" strokeDasharray="3 4" />
      <path d="M13 68L25 70M10 86L24 85M14 105L26 99M131 71L144 65M132 86L149 86M131 101L144 109" />
    </>
  ),
  holdlight: (
    <>
      <path d="M87 53C72 45 71 63 81 69C95 76 102 60 87 53ZM81 71L73 98L54 105L43 124M74 98L95 112L104 104M81 77L99 66L106 42M76 78L60 68L48 77" />
      <path d="M101 35Q111 28 118 37L113 44L102 43ZM39 76L48 70L55 79L49 86L37 83ZM99 105L109 99L116 110L106 116ZM33 125Q42 117 49 127L43 134L32 133Z" />
      <path className="sketch-detail" d="M113 26C128 14 144 28 133 44M85 137C103 143 126 134 122 120" strokeDasharray="2 5" />
    </>
  ),
}

export default function ProjectIllustration({ id }: { id: ProjectId }) {
  const { language } = useSite()
  const visual = projectVisuals[id]
  if (!visual.illustration && !sketches[id]) return null
  const label = visual.illustrationAlt ? copy(visual.illustrationAlt, language) : ''
  return (
    <span className={`project-illustration${id === 'alice' ? ' project-illustration--still' : ''}${id === 'holdlight' ? ' project-illustration--large' : ''}`}>
      {visual.illustration ? (
        <img src={assetUrl(visual.illustration)} alt={label} loading="lazy" width="160" height="160" />
      ) : (
        <svg viewBox="0 0 160 160" role="img" aria-label={label} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {sketches[id]}
        </svg>
      )}
    </span>
  )
}
