import { useId, useState } from 'react'
import { StitchedVideo } from '../../components/ProjectDemoVideo'
import { assetUrl } from '../../data/projectVisuals'
import { useSite } from '../../lib/SiteContext'
import { XrayZoomButton } from './XrayImageZoom'
import './showcase.css'

type Text = readonly [english: string, chinese: string]
type Plate = {
  file: string
  width: number
  height: number
  label: Text
  detail: Text
}

const media = (file: string) => assetUrl(`projects/xray/showcase/${file}`)

const body: Plate[] = [
  { file: 'body-surface', width: 660, height: 1260, label: ['Surface', '实体'], detail: ['Frontal view of the BodyParts3D surface mesh.', 'BodyParts3D 人体体表的正位图。'] },
  { file: 'body-projection', width: 660, height: 1260, label: ['X-ray', 'X 光'], detail: ['The same subject in transmission, with bone and soft tissue superimposed.', '同一人体的正位透射图，骨骼与软组织沿射线方向重叠。'] },
]
const chest: Plate[] = [
  { file: 'chest', width: 820, height: 890, label: ['Chest close-up', '胸廓特写'], detail: ['The ribs overlap the spine in this frame from the Unity recording.', '截自 Unity 录屏。肋骨与脊柱在投影中重叠。'] },
]
const angles: Plate[] = [
  { file: 'full-front', width: 344, height: 620, label: ['Frontal', '全身正位'], detail: ['Viewed from the front, the limbs appear on either side of the trunk.', '从正面看，躯干与两侧肢体分开。'] },
  { file: 'full-oblique', width: 344, height: 620, label: ['Oblique', '全身斜位'], detail: ['At an oblique angle, the shoulder girdle, chest and limbs begin to overlap.', '换到斜位，肩带、胸廓与四肢开始重叠。'] },
  { file: 'full-side', width: 344, height: 620, label: ['Lateral', '全身侧位'], detail: ['Viewed from the side, the legs and pelvis overlap along the ray path.', '从侧面看，双腿与骨盆沿射线路径重叠。'] },
]
const legs: Plate[] = [
  { file: 'leg-front', width: 570, height: 609, label: ['Frontal', '小腿正位'], detail: ['The cortical shell gives the long bones a bright edge on either side.', '骨皮质在长骨两侧形成亮边。'] },
  { file: 'leg-oblique', width: 570, height: 609, label: ['Oblique', '小腿斜位'], detail: ['The overlap at the knee and ankle changes as the projection turns.', '换一个角度，观察膝部与脚踝重叠的变化。'] },
]
const controls: Plate[] = [
  { file: 'unity-controls', width: 1200, height: 675, label: ['Leg framing and display window in Unity', 'Unity 中的腿部取景与调窗面板'], detail: ['The regional preset changes the framing and display window. Black point, white point and midtone map the recorded signal to the screen.', '区域预设调整取景和显示窗。黑点、白点和中间调用来把投影信号映射到屏幕上。'] },
]
const phantom: Plate[] = [
  { file: 'phantom-pa', width: 512, height: 512, label: ['PA', '正位 PA'], detail: ['In the posterior-to-anterior projection, locate the outer shell and the parts inside it.', '射线从后向前穿过标定体，可以对照壳体与内部零件的位置。'] },
  { file: 'phantom-left', width: 512, height: 512, label: ['Left lateral', '左侧位'], detail: ['From the left, the plates and rods overlap in a different order.', '换到左侧，沿深度方向分开的板和杆重新叠加。'] },
  { file: 'phantom-oblique', width: 512, height: 512, label: ['30° oblique', '30° 斜位'], detail: ['The off-centre sphere and air hole help track orientation in the oblique view.', '偏心球和空气孔帮助辨认斜位的投射方向。'] },
]
const exposure: Plate[] = [
  { file: 'noise-ideal', width: 276, height: 414, label: ['Ideal', '理想投影'], detail: ['Ideal projection without photon noise.', '无光子噪声的理想投影。'] },
  { file: 'noise-1000', width: 276, height: 414, label: ['1,000 photons', '1,000 光子'], detail: ['At 1,000 incident photons per pixel the grain is easy to see.', '空场每像素 1,000 个光子，颗粒明显。'] },
  { file: 'noise-4000', width: 276, height: 414, label: ['4,000 photons', '4,000 光子'], detail: ['The same projection at 4,000 incident photons per pixel.', '同一投影，空场每像素 4,000 个光子。'] },
  { file: 'noise-16000', width: 276, height: 414, label: ['16,000 photons', '16,000 光子'], detail: ['At 16,000 incident photons per pixel the grain is finer.', '空场每像素 16,000 个光子，颗粒较细。'] },
]

function Plates({ plates, layout }: { plates: Plate[]; layout: 'single' | 'pair' | 'three' | 'four' }) {
  const { t } = useSite()
  return <div className={`xray-plates xray-plates--${layout}`}>
    {plates.map(plate => {
      const label = t(...plate.label)
      const detail = t(...plate.detail)
      const src = media(plate.file + '.webp')
      const displayWidth = Math.min(plate.width, 340 * plate.width / plate.height)
      return <figure key={plate.file} style={{ width: displayWidth }}>
        <XrayZoomButton src={src} caption={detail}>
          <img src={src} alt={detail} width={plate.width} height={plate.height} loading="lazy" decoding="async" />
        </XrayZoomButton>
        <figcaption>{label}</figcaption>
      </figure>
    })}
  </div>
}

// Native radio groups keep keyboard selection and the selected state in sync.
function Choices({ label, options, value, onChange }: {
  label: string
  options: readonly Text[]
  value: number
  onChange: (index: number) => void
}) {
  const { t } = useSite()
  const groupName = useId()
  return <fieldset className="xray-study-choices">
    <legend className="visually-hidden">{label}</legend>
    {options.map((option, i) => <label key={option[0]}>
      <input type="radio" name={groupName} checked={value === i} onChange={() => onChange(i)} />
      <span>{t(...option)}</span>
    </label>)}
  </fieldset>
}

const subjects: Text[] = [
  ['Human body', '人体'], ['Lower leg', '小腿'], ['Calibration phantom', '标定体'], ['Photon noise', '光子噪声'],
]
const bodyViews: Text[] = [
  ['Surface and X-ray', '实体与透射'], ['Chest close-up', '胸廓特写'], ['Three angles', '三个角度'],
]

export function XrayShowcase() {
  const { t } = useSite()
  const [subject, setSubject] = useState(0)
  const [view, setView] = useState(0)
  return <section className="xray-showcase" id="xray-showcase" aria-labelledby="xray-showcase-title">
    <h2 id="xray-showcase-title">{t('Projection studies', '投影对照')}</h2>
    <Choices label={t('Choose a projection study', '选择对照对象')} options={subjects} value={subject} onChange={setSubject} />
    <div className="xray-study-panel" key={subject}>
      {subject === 0 && <>
        <p>{t('These Unity captures show how the external form and the projected anatomy line up, and how structures overlap as the view turns.', '这些 Unity 实拍画面把体表与投影对在一起。转动视角，可以看到哪些结构会在射线路径上重叠。')}</p>
        <Choices label={t('Human body view', '人体视图')} options={bodyViews} value={view} onChange={setView} />
        {view === 0 && <Plates plates={body} layout="pair" />}
        {view === 1 && <Plates plates={chest} layout="single" />}
        {view === 2 && <Plates plates={angles} layout="three" />}
      </>}
      {subject === 1 && <>
        <p>{t('In the lower leg, the cortical shell is visible along both edges of the long bones. Follow those edges from the frontal view into the oblique view.', '在小腿投影中，长骨两侧的亮边勾出了骨皮质。对照正位和斜位，可以沿着亮边观察它与膝部、脚踝的重叠。')}</p>
        <Plates plates={legs} layout="pair" />
        <Plates plates={controls} layout="single" />
      </>}
      {subject === 2 && <>
        <p>{t('The off-centre sphere and air hole are landmarks. As the source and detector rotate, follow where the shell, plates and rods overlap.', '偏心球和空气孔是辨认方向的标记。沿三个投射方向观察壳体、板和杆的叠加位置。')}</p>
        <Plates plates={phantom} layout="three" />
      </>}
      {subject === 3 && <>
        <p>{t('The leg pose and display window stay fixed. Only the open-beam photon count per pixel changes. Compare the grain against the ideal projection.', '固定腿部姿态和显示窗，只改变空场每像素的光子数。以理想投影为参照，观察颗粒的变化。')}</p>
        <Plates plates={exposure} layout="four" />
      </>}
    </div>
  </section>
}

export function XrayFilm() {
  const { t } = useSite()
  return <section id="xray-film" className="xray-film" aria-labelledby="xray-film-title">
    <h2 id="xray-film-title">{t('Unity recording', 'Unity 运行演示')}</h2>
    <p>{t('This two-minute silent recording moves from the surface model to the X-ray projection, then follows the chest and legs before adjusting the display window at a fixed pose.', '这段两分钟的无声录屏从实体切换到 X 光投影，依次环绕胸廓、拉近下肢，最后在固定姿态下调整显示窗。')}</p>
    <StitchedVideo
      src={media('demo.mp4')} poster={media('demo.webp')} aspect="16 / 9" border="blue" muted
      title={t('X-ray projection in Unity', 'Unity 实时 X 光投影演示')}
      cues={[
        { seconds: 0, label: t('Surface model', '实体开场'), thumbnail: media('demo.webp') },
        { seconds: 50, label: t('Chest orbit', '胸廓环绕'), thumbnail: media('cue-chest.webp') },
        { seconds: 68, label: t('Lower legs', '下肢特写'), thumbnail: media('cue-legs.webp') },
        { seconds: 98, label: t('Display window', '固定姿态调窗'), thumbnail: media('cue-window.webp') },
      ]}
    />
  </section>
}
