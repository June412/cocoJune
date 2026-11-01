import { useId } from 'react'
import type { ProjectId } from '../data/content'

/** Original schematic covers; these are illustrations, not project screenshots. */
export default function ProjectArtwork({ id }: { id: ProjectId }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      className={`project-artwork art-${id}`}
      viewBox="0 0 600 440"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={`${uid}-knit`} width="22" height="26" patternUnits="userSpaceOnUse">
          <path d="M1 1c0 10 10 9 10 24C11 10 21 11 21 1" stroke="#e5e7df" strokeWidth="4" />
          <path d="M1 1c0 10 10 9 10 24C11 10 21 11 21 1" stroke="#4d685a" strokeWidth=".8" />
        </pattern>
        <pattern id={`${uid}-stripe`} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M2 0v10M5 0v10" stroke="#af8572" strokeWidth="1.2" />
        </pattern>
        <pattern id={`${uid}-paper`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="7" r=".7" fill="#8d877a" opacity=".15" />
          <circle cx="18" cy="20" r=".5" fill="#8d877a" opacity=".12" />
        </pattern>
        <linearGradient
          id={`${uid}-glass`}
          x1="100"
          y1="100"
          x2="500"
          y2="330"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e0e6e1" />
          <stop offset="1" stopColor="#98b4b5" />
        </linearGradient>
      </defs>
      {id === 'tinyroomies' && (
        <>
          <rect width="600" height="440" fill="#dbe2d6" />
          <ellipse cx="305" cy="352" rx="191" ry="25" fill="#adbaa9" opacity=".35" />
          <path d="m108 288 189 101 196-108-193-96Z" fill="#c0aa8e" />
          <path d="M108 288V117l192 94v174Z" fill="#f4eddd" />
          <path d="m300 211 193-99v169L300 385Z" fill="#ddd8be" />
          <path d="m129 145 68 34v68l-68-35Z" fill="#a4bfbd" stroke="#baaa8e" strokeWidth="6" />
          <path d="m163 162 1 68m-35-51 68 33" stroke="#f6f2e8" strokeWidth="3" />
          <path d="m369 194 82-42v64l-82 43Z" fill="#ece6d8" stroke="#b3b29a" strokeWidth="4" />
          <path d="m385 218 49-25" stroke="#a4b5a1" strokeWidth="16" />
          <path d="m223 289 79 40 81-45-80-40Z" fill="#ab7050" />
          <path d="m223 289 79 40v12l-79-40Zm79 40 81-45v12l-81 45Z" fill="#8f6147" />
          <path d="M237 305v39m65-10v40m66-69v34" stroke="#885e45" strokeWidth="7" />
          <path d="m257 286 43 21 32-18-42-20Z" fill="#eee6ce" />
          <path d="m270 282 25 12m-19-17 25 12" stroke="#b1b8a4" strokeWidth="2" />
          <path d="m175 294 18 9v-24l-18-9Z" fill="#b28c69" />
          <path d="m169 274 28 13 21-12-26-13Z" fill="#caab89" />
          <path d="M178 286v37m27-37v24" stroke="#9e7759" strokeWidth="6" />
          <path
            d="M417 274c-2-22-11-28-13-43 15 3 18 13 13 43Zm0-4c5-24 17-30 24-37 5 23-4 35-24 37Z"
            fill="#73896c"
          />
          <path d="m405 270 28-13-4 30-20 9Z" fill="#cb967d" />
          <circle cx="333" cy="256" r="9" fill="#e9d2af" />
          <path d="M325 265c-7 5-7 16-4 23l21-1c3-10-1-19-9-23" fill="#7f9b94" />
          <path
            d="M178 94c54-23 117-19 150-6"
            stroke="#849b80"
            strokeWidth="1.5"
            strokeDasharray="4 7"
          />
          <path d="m321 81 9 7-11 4" stroke="#849b80" strokeWidth="1.5" />
        </>
      )}
      {id === 'textile-toolkit' && (
        <>
          <rect width="600" height="440" fill="#e6e2d7" />
          <path d="m132 95 263-18 30 284-269 10Z" fill="#a8ad98" opacity=".35" />
          <g transform="rotate(-9 280 215)">
            <rect x="140" y="84" width="248" height="267" rx="2" fill="#e5d5bb" />
            <rect x="148" y="92" width="232" height="251" stroke="#bfae90" strokeDasharray="3 4" />
            <path
              d="M160 108h208M160 130h208M160 152h208M160 174h208M160 196h208M160 218h208M160 240h208M160 262h208M160 284h208M160 306h208"
              stroke="#c6b796"
              strokeWidth=".7"
            />
          </g>
          <g transform="rotate(10 354 241)">
            <rect x="248" y="121" width="208" height="247" fill="#be9b88" />
            <rect x="248" y="121" width="208" height="247" fill={`url(#${uid}-stripe)`} />
            <path d="M258 131h188v227H258Z" stroke="#e4d2c0" strokeDasharray="4 4" />
          </g>
          <g transform="rotate(-4 250 234)">
            <rect x="157" y="116" width="191" height="247" fill="#71836b" />
            <rect x="157" y="116" width="191" height="247" fill={`url(#${uid}-knit)`} />
            <path d="M164 123h177v233H164Z" stroke="#e9e6d7" strokeDasharray="3 5" />
          </g>
          <circle cx="183" cy="139" r="10" fill="#d9d1bc" stroke="#54674e" />
          <circle cx="180" cy="136" r="1.4" fill="#7f8672" />
          <circle cx="186" cy="142" r="1.4" fill="#7f8672" />
          <path
            d="M381 337c83 52 114 7 88-11-37-26-59 38-23 50"
            stroke="#59756d"
            strokeWidth="2.5"
          />
          <path d="m398 305 31 50" stroke="#948976" strokeWidth="2" />
          <circle cx="397" cy="304" r="2" stroke="#948976" />
          <path d="M100 217v91m-5-85 5-6 5 6m-10 79 5 6 5-6" stroke="#938f7e" />
        </>
      )}
      {id === 'alice' && (
        <>
          <rect width="600" height="440" fill="#eaded4" />
          <ellipse cx="299" cy="351" rx="162" ry="24" fill="#bca99b" opacity=".2" />
          <g transform="rotate(-8 240 243)">
            <path
              d="M185 183c-15 11-48 72-36 85 13 14 37-31 41-37l-4 63c-12 14-17 42-4 49 17 8 33-29 37-43h29c4 20 19 52 33 43 16-11 1-38-7-49l-4-63c7 14 31 48 43 35 9-14-13-62-36-83Z"
              fill="#b7bda7"
              stroke="#9ca58e"
              strokeWidth="2"
            />
            <ellipse cx="231" cy="153" rx="45" ry="46" fill="#e6c8b0" />
            <path
              d="M186 155c-5-42 11-56 41-55 33-5 57 25 49 57-8-11-16-20-18-37-13 19-34 25-72 35Z"
              fill="#aa8466"
            />
            <circle cx="216" cy="160" r="2.5" fill="#687264" />
            <circle cx="247" cy="160" r="2.5" fill="#687264" />
            <path d="M226 177q7 5 14-1" stroke="#b98271" strokeWidth="2" />
            <path d="m198 213 51 1 1 52-53-1Z" fill="#f1e6d8" />
            <path
              d="M197 213h52v52h-52Z"
              stroke="#9a7c68"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
            <path
              d="m224 218-5 41m-7-32 21 1m-24 12 27 1m-24 10 21 1"
              stroke="#a77e69"
              strokeWidth="1.5"
            />
          </g>
          <g transform="rotate(13 398 278)">
            <rect x="363" y="232" width="71" height="94" rx="9" fill="#afbfbc" />
            <ellipse cx="398" cy="232" rx="41" ry="12" fill="#d6dfd5" />
            <ellipse cx="398" cy="326" rx="41" ry="12" fill="#c4d1c6" />
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <path key={n} d={`M367 ${244 + n * 11}q30 9 63 0`} stroke="#75938d" strokeWidth="2" />
            ))}
          </g>
          <path
            d="M415 317c68 38 57 72 15 62-42-11-1-51-25-71-36-31-75 23-111-14"
            stroke="#79938c"
            strokeWidth="2"
          />
          <path d="m322 205 32-75" stroke="#8c8d87" strokeWidth="2.5" />
          <ellipse
            cx="352"
            cy="133"
            rx="1.8"
            ry="5"
            transform="rotate(23 352 133)"
            stroke="#7c817d"
          />
          <path
            d="M353 128c-5-42 67-21 52 5-16 27-38 40-23 74"
            stroke="#79938c"
            strokeWidth="1.5"
          />
        </>
      )}
      {id === 'between-sips' && (
        <>
          <rect width="600" height="440" fill="#dbe3dc" />
          <circle cx="433" cy="103" r="43" fill="#ece6ca" />
          <path
            d="M0 270c80-77 138-125 219-53 81-120 148-67 230-20 69-61 100-88 151-61v304H0Z"
            fill="#a8bbac"
          />
          <path d="M0 336c124-115 206 25 294-68 104-110 186-30 306-72v244H0Z" fill="#789383" />
          <path d="M0 383c143-78 260 25 351-45 85-68 160 7 249-49v151H0Z" fill="#5f7e6d" />
          <path d="M0 357c116 10 209-2 294 32 76 31 176-49 306-17v68H0Z" fill="#c7b794" />
          <ellipse cx="278" cy="349" rx="73" ry="15" fill="#ede9d7" />
          <path d="M223 289h107c-2 36-20 57-51 57s-48-21-56-57Z" fill="#f0ecdd" />
          <path d="M330 300c42-14 41 39-12 33" stroke="#f0ecdd" strokeWidth="10" />
          <ellipse cx="276" cy="289" rx="54" ry="13" fill="#f5f0df" />
          <ellipse cx="276" cy="289" rx="44" ry="8" fill="#a8ad76" />
          <path
            d="M260 266c-31-27 36-33 12-62m18 59c-22-19 26-34 10-56"
            stroke="#f5f1e4"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M95 292c12-47 11-83 0-130m4 41c18-28 38-25 40-24-8 22-20 31-40 24Zm0 30c-25-26-42-16-45-13 11 20 27 25 45 13Z"
            stroke="#647d65"
            strokeWidth="3"
            fill="#6f876c"
          />
          <path d="m444 351 16 42m-1-27 19-14m-22 26-17-6" stroke="#897c59" strokeWidth="3" />
        </>
      )}
      {id === 'perspective-freeze' && (
        <>
          <rect width="600" height="440" fill="#e2e6e4" />
          <g stroke="#a9b7b3" strokeWidth="1">
            <path d="M46 340 300 196 554 340M91 365 300 246 509 365M150 392l150-87 150 87M300 196v217M50 340l250 73 250-73" />
          </g>
          <path d="m221 157 119-47 87 65-120 56Z" fill="#f0dfca" fillOpacity=".8" />
          <path d="m221 157 86 74v120l-86-74Z" fill="#b4c5bf" fillOpacity=".8" />
          <path d="m307 231 120-56v116l-120 60Z" fill={`url(#${uid}-glass)`} />
          <g stroke="#567b77" strokeWidth="1.5">
            <path d="m221 157 119-47 87 65-120 56-86-74v120l86 74 120-60V175m-120 56v120" />
            <path d="M182 115h180v203H182Z" strokeDasharray="5 6" />
          </g>
          <circle cx="182" cy="115" r="4" fill="#8a9d8d" />
          <circle cx="362" cy="318" r="4" fill="#8a9d8d" />
          <path d="M144 285c-29-26-37-68-8-108m-3 2 4-7 4 9" stroke="#b78d73" strokeWidth="1.4" />
          <circle cx="485" cy="110" r="20" stroke="#a9b7b3" />
          <path d="M476 110h18m-9-9v18" stroke="#a9b7b3" />
        </>
      )}
      {id === 'x-ray' && (
        <>
          <rect width="600" height="440" fill="#dce6e3" />
          <g stroke="#98b5af" strokeWidth="1">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
              <path key={n} d={`M118 228 435 ${88 + n * 39}`} />
            ))}
          </g>
          <g transform="translate(285 218) rotate(-12)">
            {[0, 1, 2, 3, 4].map((n) => (
              <ellipse
                key={n}
                cx={n * 11}
                cy="0"
                rx="68"
                ry="108"
                fill="#bed2cc"
                fillOpacity=".18"
                stroke="#789e94"
                strokeWidth="1.2"
              />
            ))}
            <path
              d="M-27-69c52-21 70 19 48 49-18 25 11 50 2 72-20 36-63 16-52-20 13-43-20-54 2-101Z"
              fill="#7c9e90"
              fillOpacity=".3"
            />
          </g>
          <circle cx="118" cy="228" r="11" fill="#ae8971" />
          <circle cx="118" cy="228" r="22" stroke="#ae8971" strokeDasharray="3 4" />
          <path d="M435 87v303" stroke="#718e85" strokeWidth="4" />
          <path d="m435 87 30-18v303l-30 18" fill="#aec6bf" fillOpacity=".3" stroke="#718e85" />
        </>
      )}
      {id === 'holdlight' && (
        <>
          <rect width="600" height="440" fill="#e7e3d7" />
          <path d="M133 65h334v320H133Z" fill="#d7d9c9" />
          <g stroke="#b8c0b0" strokeWidth="1">
            {[0, 1, 2, 3, 4, 5, 6].map((n) => (
              <path key={n} d={`M133 ${90 + n * 44}h334M${152 + n * 48} 65v320`} />
            ))}
          </g>
          <path
            d="M220 357c-28-63 117-41 107-116-7-49-66-36-53-93 7-29 62-13 78-57"
            stroke="#768d73"
            strokeWidth="3"
            strokeDasharray="6 8"
          />
          {[
            [214, 340, '#ac896c'],
            [284, 291, '#798d77'],
            [327, 233, '#b8a085'],
            [273, 164, '#79958c'],
            [351, 99, '#a8876f'],
            [192, 191, '#a7b0a3'],
            [402, 293, '#a7b0a3'],
            [401, 159, '#a7b0a3'],
            [199, 106, '#b5ad9a'],
          ].map(([x, y, color], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${i * 27})`}>
              <path d="M-13-5 0-13 18-3 13 12-15 10Z" fill={String(color)} />
              <circle r="2" fill="#e9e5d9" />
            </g>
          ))}
          <circle cx="327" cy="233" r="28" stroke="#79958c" strokeWidth="1.5" />
          <path d="M485 138v149m-5-141 5-8 5 8" stroke="#9aab9d" />
        </>
      )}
      <rect
        width="600"
        height="440"
        fill={`url(#${uid}-paper)`}
        style={{ mixBlendMode: 'multiply' }}
      />
    </svg>
  )
}
