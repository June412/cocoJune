import { useState, type ReactNode } from 'react'
import { assetUrl } from '../../data/projectVisuals'
import { useSite } from '../../lib/SiteContext'
import ProjectProcess from '../../components/ProjectProcess'
import { XrayZoomButton } from './XrayImageZoom'
import SphereTransmissionFigure from './SphereTransmissionFigure'
import './xray-story.css'

const imageSizes = {
  'anatomy-mesh-audit': [1080, 823],
  'attenuation-slices': [1000, 520],
  'bone-cross-sections': [1000, 347],
  'sphere-phantom': [630, 469],
  'slab-phantom': [630, 469],
  'calibration-phantom': [630, 469],
} as const

const links = {
  bodyParts: 'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html',
  zAnatomy: 'https://github.com/Z-Anatomy/Models-of-human-anatomy',
  humanAtlas: 'https://humanatlas.io/3d-reference-library',
  chest: 'https://www.ncbi.nlm.nih.gov/books/NBK558976/figure/article-37405.image.f1/',
  wrist: 'https://introductiontoradiology.net/courses/rad/ext/1hw/01anatomy.html',
  water: 'https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/water.html',
  bone: 'https://physics.nist.gov/PhysRefData/XrayMassCoef/ComTab/bone.html',
  mip: 'https://slicer.readthedocs.io/en/5.4/user_guide/modules/volumerendering.html',
  diffDrr: 'https://github.com/eigenvivek/DiffDRR',
  license: 'https://creativecommons.org/licenses/by/4.0/',
}

function Plate({ image, caption }: { image: keyof typeof imageSizes; caption: string }) {
  const url = assetUrl(`projects/xray/story/${image}.webp`)
  const [width, height] = imageSizes[image]
  return <figure className="xray-story-plate">
    <XrayZoomButton src={url} caption={caption}>
      <img src={url} width={width} height={height} alt={caption} loading="lazy" decoding="async" />
    </XrayZoomButton>
    <figcaption>{caption}</figcaption>
  </figure>
}

function DataTable({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) {
  return <div className="report-table xray-data-table"><table>
    <thead><tr>{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
    <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>
      {row.map((cell, columnIndex) => columnIndex === 0
        ? <th key={columnIndex} scope="row">{cell}</th>
        : <td key={columnIndex}>{cell}</td>)}
    </tr>)}</tbody>
  </table></div>
}

function ProjectionDiagram() {
  const { t } = useSite()
  const [pixel, setPixel] = useState(2)
  const detectorY = [40, 64, 88, 112, 136]
  const label = t('Detector pixel', '探测器像素')
  const value = t(`Pixel ${pixel + 1} of 5`, `第 ${pixel + 1} 个像素，共 5 个`)
  return <figure className="xray-projection-diagram">
    <svg viewBox="0 0 430 170" role="img" aria-label={t('Five rays from a point source pass through a volume to five detector pixels. The selected ray is highlighted.', '五条射线从点光源穿过衰减体，抵达五个探测器像素。选中像素对应的射线会高亮。')}>
      <g stroke="currentColor" strokeWidth="1" opacity=".38" fill="none">
        {detectorY.map(y => <path key={y} d={`M42 88 361 ${y}`} />)}
      </g>
      <path d="m170 56 53-12 28 14v65l-53 15-28-14Z" className="xray-volume-outline" />
      <path d="m170 56 28 13 53-11m-53 11v69" stroke="currentColor" fill="none" strokeWidth="1.4" />
      <path d="M361 29v119" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round" />
      {detectorY.map(y => <circle key={y} cx="361" cy={y} r="2.6" fill="currentColor" />)}
      <path d={`M42 88 361 ${detectorY[pixel]}`} className="xray-selected-ray" />
      <circle cx="361" cy={detectorY[pixel]} r="4.8" fill="var(--link)" />
      <circle cx="42" cy="88" r="5" fill="currentColor" />
      <g fill="currentColor" textAnchor="middle">
        <text x="46" y="124">{t('Point source', '点光源')}</text>
        <text x="210" y="28">{t('Attenuation volume', '三维衰减体')}</text>
        <text x="362" y="166">{t('Detector', '探测器')}</text>
      </g>
    </svg>
    <label className="xray-detector-control">
      <span>{label}</span>
      <input type="range" min="0" max="4" step="1" value={pixel} aria-valuetext={value}
        onChange={event => setPixel(Number(event.currentTarget.value))} />
      <span aria-hidden="true">{pixel + 1} / 5</span>
    </label>
    <figcaption>{t('Select a pixel to trace its ray. In the benchmark setup the source is 500 mm from the isocentre and 1,000 mm from the detector.', '选择一个像素，可以看到抵达它的射线。基准装置的源至等中心距离为 500 mm，源至探测器距离为 1,000 mm。')}</figcaption>
  </figure>
}

export function XrayProcess() {
  const { t } = useSite()
  return <div className="xray-story">
    <section aria-labelledby="xray-research">
      <h2 id="xray-research" data-thread-chapter>{t('Data & materials', '数据与材质')}</h2>
      <div className="study-spread xray-source-study">
        <Plate image="anatomy-mesh-audit" caption={t('BodyParts3D surface and skeletal meshes before voxelisation.', '体素化前的 BodyParts3D 体表与骨骼网格。')} />
        <div><h3>{t('Anatomy references', '解剖参考')}</h3><ul>
          <li>{t('2,234 named OBJ files reviewed. Selected one body surface and 203 bone meshes.', '核对 2,234 个有名称的 OBJ，选用一份体表与 203 个骨网格。')}</li>
          <li>{t('Frontal and lateral chest films informed rib overlap. Wrist films guided the bright cortical rim.', '用正、侧位胸片对照肋骨重叠，用腕部影像观察骨皮质亮边。')}</li>
        </ul>
        <h3>{t('Reference attenuation at 50 keV', '50 keV 参考衰减系数')}</h3>
        <DataTable columns={[t('Material','材质'), 'μ (mm⁻¹)']} rows={[
          [t('Water','水'), '0.02269'], [t('Dense cortical bone','致密皮质骨'), '0.08145'],
        ]} /></div>
      </div>
    </section>

    <section aria-labelledby="xray-projection">
      <h2 id="xray-projection" data-thread-chapter>{t('Volume rendering', '体积渲染')}</h2>
      <DataTable columns={[t('Input', '输入'), t('Conversion', '转换'), t('Volume', '衰减体')]} rows={[
        [t('DICOM slices', 'DICOM 切片'), t('Sort by position and reconstruct the HU field.', '按空间位置排序，重建 HU 场。'), t('Map HU values to attenuation.', '将 HU 值映射为衰减系数。')],
        [t('Anatomy meshes', '解剖网格'), t('Fill each slice with soft tissue and assign bone voxels.', '逐层填入水等效软组织，再标记骨体素。'), '340 × 152 × 866 · 2 mm'],
      ]} />
      <Plate image="attenuation-slices" caption={t('Coronal, sagittal and enlarged lower-leg cross-sections share a display range of 0–0.08145 mm⁻¹. Brighter voxels have higher attenuation.', '冠状面、矢状面和放大的小腿横断面采用同一显示范围 0–0.08145 mm⁻¹。越亮的体素衰减系数越大。')} />
      <div className="study-spread">
        <div>
          <h3>{t('Ray integration', '射线积分')}</h3>
          <p>{t('One ray per detector pixel. Sample μ at each midpoint, add μ × step length, then convert optical depth τ into transmission T = exp(−τ).', '每个探测器像素对应一条射线。逐段采样中点的 μ，累加 μ × 步长得到光学厚度 τ，再计算透射率 T = exp(−τ)。')}</p>
          <ProjectionDiagram />
        </div>
        <div>
          <h3>{t('Projection workflow', '投影流程')}</h3>
          <ProjectProcess label={t('Projection workflow', '投影流程')} steps={[
            { sketch: 'volume-slices', title: t('Import a CT series or phantom', '导入 CT 序列或内置体模') },
            { sketch: 'frame-volume', title: t('Validate and auto-frame', '校验数据并自动取景') },
            { sketch: 'project-ray', title: t('Set the projection in a separate preview', '在独立预览中调整投影方向') },
            { sketch: 'export-sheet', title: t('Export PNG, raw EXR and an anonymised report', '导出 PNG、原始 EXR 与匿名参数报告') },
          ]} />
          <p>{t('The PNG stores the displayed image. The EXR preserves the original optical depth and transmission.', 'PNG 保存显示图像，EXR 保留原始光学厚度和透射率。')}</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="xray-iteration">
      <h2 id="xray-iteration" data-thread-chapter>{t('Iteration', '设计迭代')}</h2>
      <DataTable columns={[t('Observation','观察'),t('Design change','设计调整')]} rows={[
        [t('Sphere edge mismatch','球体边缘误差'), t('After two failed edge checks, compare against the exact integral of the interpolated voxel field.', '两轮边缘检验后，改用同一插值体素场的精确积分作基准。')],
        [t('Old phantom or red CT preview','预览残留体模或偏红'), t('Isolate the preview from 18 overlapping camera/display setups. Map the single-channel texture to grey.', '将预览与原先重叠的 18 组相机和显示平面隔离，单通道纹理按灰度显示。')],
        [t('Uniformly bright long bones','长骨内部过亮'), t('Give the femur a 3.5 mm cortical shell and the tibia 3 mm, with a lighter core. The rim follows the viewing angle.', '股骨和胫骨分别采用估计厚度 3.5 mm、3 mm 的骨壳与低密度内芯，亮边随视角变化。')],
        [t('Exposure and windowing','曝光与调窗'), t('A new exposure draws K ∼ Poisson(N₀T). Windowing reuses those counts and preserves their grain.', '重新曝光按 K ∼ Poisson(N₀T) 采样。调窗复用同一组计数，保留颗粒分布。')],
      ]} />
      <Plate image="bone-cross-sections" caption={t('Solid bone (left) and shell/core (right), slice Z = 305, same window. The reference energy also changed from 80 to 50 keV.', '左为实心骨，右为骨壳与内芯。切片 Z = 305，显示窗相同。参考能量也从 80 调整为 50 keV。')} />
    </section>
  </div>
}

export function XrayFindings() {
  const { t } = useSite()
  return <div className="xray-story">
    <section aria-labelledby="xray-validation">
      <h2 id="xray-validation" data-thread-chapter>{t('Validation', '性能验证')}</h2>
      <p>{t('I wanted a numerical check on what I was seeing. With simple test objects of known geometry and materials, I could predict a value first, then check the renderer.', '要判断数值是否准确，单看骨骼图像还不够。我使用形状和材料已知的简单体模，先算出预期值，再检查渲染结果。')}</p>
      <div className="xray-phantom-plates">
        <Plate image="sphere-phantom" caption={t('Uniform sphere. The central ray travels the longest path.', '均匀球体。经过球心的射线路径最长。')} />
        <Plate image="slab-phantom" caption={t('Two slabs, each 10 mm thick. Their expected central optical depth is 0.4.', '双材料平板，各厚 10 mm。正位中心光学厚度的预期值为 0.4。')} />
        <Plate image="calibration-phantom" caption={t('An off-centre sphere, plate, rod and air hole make projection direction visible.', '偏心球、板、杆和空气孔让投影方向一目了然。')} />
      </div>
      <SphereTransmissionFigure />
      <h3>{t('Reference checks', '参考值检验')}</h3>
      <DataTable columns={[t('Check', '检验项'), t('Result', '结果')]} rows={[
        [t('Integration', '积分'), t('811 rays passed comparison with the exact voxel-field integral.', '811 条射线通过同一体素场的精确积分参考检验。')],
        [t('Geometry', '几何'), t('Predicted projected radius 40.032 mm. Both measured axes gave 40.5 mm, a difference of 0.468 pixels.', '投影球半径的解析值为 40.032 mm。横纵实测均为 40.5 mm，相差 0.468 像素。')],
        [t('Repeatability', '重复性'), t('The slab and the sphere each produced bit-identical GPU output across 100 renders.', '平板和球体分别重复渲染 100 次，各自的 GPU 输出逐位一致。')],
        [t('Browser and Unity', '网页与 Unity'), t('Across six matched 384 × 256 images at 1 mm steps, the maximum difference was one 8-bit grey level in each view.', '以相同视角、1 mm 步长比对六组 384 × 256 图像，各组最大差异均为一个 8 位灰度级。')],
        [t('Regression tests', '回归测试'), 'Unity 850/850 · Python 191/191'],
      ]} />
      <h3>{t('Photon noise', '光子噪声')}</h3>
      <p>{t('In a uniform field at T = 0.25, quadrupling the expected open-beam photon count approximately halved the measured relative noise on Metal.', '在 T = 0.25 的均匀场中，空场光子数增加到四倍，Metal 上实测的相对噪声约减半。')}</p>
      <DataTable columns={[t('Open-beam photons / pixel', '空场光子数 / 像素'), t('Expected relative noise', '理论相对噪声'), t('Measured on Metal', 'Metal 实测')]}
        rows={[['1,000', '6.325%', '6.316%'], ['4,000', '3.162%', '3.165%']]} />
      <h3>{t('Projection time', '投影耗时')}</h3>
      <p>{t('On an Apple M5 Pro using Metal, I warmed up each configuration twice and timed five runs. The medians below cover allocation, projection and synchronous readback. Scene rendering and interface work are excluded from those timings.', '在 Apple M5 Pro 的 Metal 后端上，我为每档配置预热 2 次，再测量 5 次取中位数。计时覆盖分配、投影和同步读回，场景绘制与界面耗时另计。')}</p>
      <DataTable columns={[t('Resolution', '分辨率'), t('Step length', '采样步长'), t('Median time', '中位耗时')]} rows={[
        ['384 × 216', '2 mm', '1.76 ms'], ['768 × 432', '1 mm', '4.71 ms'], ['1024 × 576', '0.5 mm', '10.40 ms'],
      ]} />
      <h3>{t('Projection methods', '投影方法')}</h3>
      <DataTable columns={[t('Method', '方法'),t('Key property', '特性')]} rows={[
        [t('This renderer','本项目'), t('Accumulates attenuation. Doubling uniform thickness changes T to T².', '沿途累积衰减。均匀材料厚度加倍，透射率变为 T²。')],
        [t('Maximum intensity projection', '最大强度投影'), t('Uses the largest voxel value. Additional thickness leaves that peak unchanged.', '取沿途体素最大值，增加同种材料的厚度会保留峰值。')],
        ['DiffDRR', t('Differentiable PyTorch projection for gradient-based pose optimisation.', '可微分的 PyTorch 投影，可用梯度优化位姿。')],
      ]} />
    </section>

    <section aria-labelledby="xray-outlook">
      <h2 id="xray-outlook" data-thread-chapter>{t('Applications & limits', '应用与局限')}</h2>
      <ul>
        <li><strong>{t('Uses','用途')}</strong> · {t('Explore skeletal overlap, check geometry against a phantom and compare exposure grain at a fixed angle.', '观察骨骼重叠，用体模检验投影几何，在固定视角比较曝光颗粒。')}</li>
        <li><strong>{t('Limits','局限')}</strong> · {t('Single-energy primary rays, water-equivalent tissue and estimated bone shells. Lung tissue, trabeculae, scatter and device calibration remain unmodelled.', '采用单能直达射线、水等效软组织和估计骨壳。模型尚未包含肺实质、骨小梁、散射和设备标定。')}</li>
        <li><strong>{t('Next tests','后续验证')}</strong> · {t('Match CT and detector geometry with an independent DRR renderer for pixel-wise error maps. Measure median and P95 frame time during continuous rotation, with and without noise.', '与独立 DRR 实现对齐 CT 和投影几何，生成逐像素误差图。测量连续旋转时理想与含噪模式的整帧中位耗时和 P95。')}</li>
      </ul>
    </section>

    <section aria-labelledby="xray-sources">
      <h2 id="xray-sources" data-thread-chapter>{t('References', '参考资料')}</h2>
      <p>{t('Human geometry from BodyParts3D, © The Database Center for Life Science. I selected and simplified the meshes, voxelised them and assigned materials. The browser projection uses 8-bit quantisation. The raw Unity output uses 32-bit floating point.', '人体几何来自 BodyParts3D，© The Database Center for Life Science。我对网格进行了筛选、简化、体素化和材料赋值。网页投影采用 8 位量化，Unity 原始输出为 32 位浮点。')} <a href={links.bodyParts}>BodyParts3D</a> · <a href={links.license}>CC BY 4.0</a></p>
      <ul className="xray-references">
        <li>{t('Anatomy libraries considered', '调研过的解剖图库')} · <a href={links.zAnatomy}>Z-Anatomy</a> · <a href={links.humanAtlas}>Human Reference Atlas</a></li>
        <li>{t('Radiograph references', '影像参考')} · <a href={links.chest}>{t('Chest films', '胸片')}</a> · <a href={links.wrist}>{t('Wrist anatomy', '腕部解剖片')}</a></li>
        <li>{t('NIST attenuation tables', 'NIST 衰减系数表')} · <a href={links.water}>{t('Water', '水')}</a> · <a href={links.bone}>{t('Cortical bone', '皮质骨')}</a></li>
        <li>{t('Projection methods', '投影方法')} · <a href={links.mip}>{t('3D Slicer volume rendering', '3D Slicer 体渲染')}</a> · <a href={links.diffDrr}>DiffDRR</a></li>
      </ul>
    </section>
  </div>
}
