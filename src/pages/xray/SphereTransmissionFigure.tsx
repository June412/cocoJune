import { useId, useLayoutEffect, useRef, useState } from 'react'
import { useSite } from '../../lib/SiteContext'
import { XrayZoomButton } from './XrayImageZoom'

const radiusMm = 20
const attenuationPerMm = 0.02
function transmission(offsetMm: number) {
  const chordMm = 2 * Math.sqrt(Math.max(0, radiusMm ** 2 - offsetMm ** 2))
  return Math.exp(-attenuationPerMm * chordMm)
}

// The phantom reference samples 128 voxel centres at a spacing of 1 mm.
// The published figure shows the central 68 mm of that profile.
const extent = 34
const offsets = Array.from({ length: 128 }, (_, i) => i - 63.5)
const visibleOffsets = [-extent, ...offsets.filter(x => Math.abs(x) < extent), extent]
const xTicks = [-30, -20, -10, 0, 10, 20, 30]
const yTicks = [0.4, 0.6, 0.8, 1]
const centreValue = transmission(0)

function TransmissionPlot() {
  const { t } = useSite()
  const id = useId()
  const svg = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(720)
  useLayoutEffect(() => {
    const node = svg.current
    if (!node) return
    const resize = () => {
      const measured = Math.round(node.getBoundingClientRect().width)
      if (measured > 0) setWidth(measured)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const compact = width < 460
  const height = Math.round(Math.max(218, width * 0.46))
  const left = compact ? 47 : 64
  const right = width - (compact ? 10 : 20)
  const top = 9
  const bottom = height - 49
  const x = (mm: number) => left + (mm + extent) / (2 * extent) * (right - left)
  const y = (value: number) => bottom - (value - 0.37) / (1.08 - 0.37) * (bottom - top)
  const line = visibleOffsets.map((offset, i) =>
    `${i ? 'L' : 'M'}${x(offset).toFixed(2)} ${y(transmission(offset)).toFixed(2)}`).join(' ')
  const labelX = x(compact ? 0 : 3.5)
  const labelY = y(compact ? 0.75 : 0.65)
  const valueLabel = '≈ ' + centreValue.toFixed(3)
  return <svg ref={svg} className="xray-transmission-plot" viewBox={`0 0 ${width} ${height}`}
    role="img" aria-labelledby={id + '-title ' + id + '-description'}>
    <title id={id + '-title'}>{t('Transmission through a uniform sphere', '均匀球体的透射率')}</title>
    <desc id={id + '-description'}>{t(
      'Transmission is one outside the sphere and falls to approximately 0.449 along the ray through its centre.',
      '球体外的透射率为 1，穿过球心的射线路径最长，透射率降至约 0.449。',
    )}</desc>
    <path d={line + ' Z'} fill="var(--ink)" fillOpacity=".12" />
    {yTicks.map(value => <g key={value}>
      <line className="xray-transmission-grid" x1={left} x2={right} y1={y(value)} y2={y(value)} />
      <text x={left - 8} y={y(value)} dy=".33em" textAnchor="end">{value.toFixed(1)}</text>
    </g>)}
    <path className="xray-transmission-axis" d={`M${left} ${top}V${bottom}H${right}`} />
    {xTicks.map(value => <g key={value}>
      <path className="xray-transmission-axis" d={`M${x(value)} ${bottom}v4`} />
      <text x={x(value)} y={bottom + 19} textAnchor="middle">{String(value).replace('-', '−')}</text>
    </g>)}
    <path className="xray-transmission-line" d={line} />
    <text className="xray-transmission-label" x={(left + right) / 2} y={height - 5} textAnchor="middle">
      {t('Lateral ray position (mm)', '射线横向位置（mm）')}
    </text>
    <text className="xray-transmission-label" transform={`translate(15 ${(top + bottom) / 2}) rotate(-90)`} textAnchor="middle">
      {t('Normalized transmission', '归一化透射率')}
    </text>
    <line className="xray-transmission-leader" x1={labelX} y1={labelY + (compact ? 21 : 7)} x2={x(0)} y2={y(centreValue)} />
    <circle cx={x(0)} cy={y(centreValue)} r="3.5" fill="var(--ink)" />
    <text className="xray-transmission-label" x={labelX} y={labelY} textAnchor="middle">
      {t('Central ray', '中心射线')}{compact ? <tspan x={labelX} dy="1.15em">{valueLabel}</tspan> : ' ' + valueLabel}
    </text>
  </svg>
}

export default function SphereTransmissionFigure() {
  const { t } = useSite()
  const caption = t(
    'The theoretical profile uses 128 ray positions. The central ray travels 40 mm through the sphere. With μ = 0.02 mm⁻¹, its transmission is exp(−0.8) ≈ 0.449.',
    '理论曲线按 128 个横向位置采样。中心射线穿过球体的路径长 40 mm，衰减系数 μ = 0.02 mm⁻¹，对应透射率为 exp(−0.8) ≈ 0.449。',
  )
  return <figure className="xray-story-plate" id="xray-sphere-profile">
    <XrayZoomButton graphic={<TransmissionPlot />} caption={caption}>
      <TransmissionPlot />
    </XrayZoomButton>
    <figcaption>{caption}</figcaption>
  </figure>
}
