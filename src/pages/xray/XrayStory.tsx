import { useState, type ReactNode } from 'react'
import { assetUrl } from '../../data/projectVisuals'
import { useSite } from '../../lib/SiteContext'
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
    <svg viewBox="0 0 430 170" role="img" aria-label={t('Five rays from a point source pass through a volume to five detector pixels. The selected ray is highlighted.', '五条射线从点光源穿过衰减体，抵达五个探测器像素。选中像素对应的射线以橙色标出。')}>
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
      <p>{t('I initially designed a common volume and coordinate system for X-ray and ultrasound. When I focused on X-ray, I needed a model whose tissues I could identify individually and assign different attenuation values.', '最初，我为 X 光和超声设计了一套共用的体数据与坐标系统。把重心转到 X 光后，我需要一份能逐一辨认组织、分别设置衰减系数的人体模型。')}</p>
      <p>{t('Z-Anatomy grouped its models by anatomical system, and the Human Reference Atlas provided organ-level references. BodyParts3D also supplied a name for each mesh. I checked its 2,234 OBJ files against the name map and selected one body surface and 203 bone meshes.', 'Z-Anatomy 按解剖系统整理模型，Human Reference Atlas 提供器官级三维参考。BodyParts3D 为网格提供了组织名称。我核对了它的 2,234 个 OBJ 与名称映射，选出一份体表网格和 203 个骨组织网格。')}</p>
      <Plate image="anatomy-mesh-audit" caption={t('The source geometry before voxelisation. The body surface is on the left, with the selected skeletal meshes viewed head-on and at an angle beside it.', '体素化之前的网格核对图。左侧是体表，旁边是筛选后骨骼的正位与斜位。')} />
      <p>{t('I used frontal and lateral chest films to study how the ribs overlap the spine. On a wrist film, the margins of the long bones looked brighter than the centre. That observation later guided the cortical-shell revision.', '我对照胸部正、侧位片，记录肋骨和脊柱怎样重叠。手腕片上的长骨边缘比中央亮，这个观察后来改变了我给骨骼赋材料的方式。')}</p>
      <p>{t('For the refined model I converted the NIST material data at a single energy of 50 keV to linear attenuation coefficients. Water was 0.02269 mm⁻¹ and dense cortical bone was 0.08145 mm⁻¹. I estimated shell thickness and the material inside the bones separately.', '在细化版中，我按 50 keV 单能参考换算 NIST 材料数据。水的线性衰减系数为 0.02269 mm⁻¹，致密皮质骨为 0.08145 mm⁻¹。骨壳厚度和内部成分则另行估计。')}</p>
    </section>

    <section aria-labelledby="xray-projection">
      <h2 id="xray-projection" data-thread-chapter>{t('Volume rendering', '体积渲染')}</h2>
      <h3>{t('Preparing the volume', '准备三维衰减体')}</h3>
      <p>{t('For CT input, I sorted the slices by spatial position, rebuilt the three-dimensional Hounsfield-unit field and mapped those values to attenuation. For the anatomical model, I filled the body surface slice by slice with water-equivalent tissue, then assigned bone material to the occupied voxels. The resulting grid held 340 × 152 × 866 voxels at 2 mm spacing.', '导入 CT 时，我按空间位置排列切片，重建三维 HU 场，再按参考曲线把 HU 转成衰减系数。对解剖网格，我逐层填充水等效软组织，将骨骼占据的体素替换为骨材料。最终衰减体为 340 × 152 × 866 个体素，间距 2 mm。')}</p>
      <Plate image="attenuation-slices" caption={t('Coronal, sagittal and enlarged lower-leg cross-sections share a display range of 0–0.08145 mm⁻¹. Brighter voxels have higher attenuation.', '冠状面、矢状面和放大的小腿横断面采用同一显示范围 0–0.08145 mm⁻¹。越亮的体素衰减系数越大。')} />
      <div className="study-spread">
        <div>
          <h3>{t('Following one ray', '跟随一条射线')}</h3>
          <p>{t('Each detector pixel receives a ray from the point source. The GPU samples the attenuation coefficient μ at the midpoint of each step and adds μ × step length to the optical depth τ. A ray that spends more of its path in dense material reaches the detector with lower transmission, T = exp(−τ).', '点光源向每个探测器像素的中心发出一条射线。GPU 在每段的中点采样衰减系数 μ，将 μ 与该段长度的乘积累加为光学厚度 τ。射线在致密材料中走得越长，抵达探测器时的透射率 T = exp(−τ) 就越低。')}</p>
          <ProjectionDiagram />
        </div>
        <div>
          <h3>{t('From import to export', '从导入到导出')}</h3>
          <ol className="project-process" aria-label={t('Projection workflow', '投影流程')}>
            <li>{t('Import a CT series or phantom', '导入 CT 序列或内置体模')}</li>
            <li>{t('Validate and auto-frame', '校验数据并自动取景')}</li>
            <li>{t('Set the projection in a separate preview', '在独立预览中调整投影方向')}</li>
            <li>{t('Export PNG, raw EXR and an anonymised report', '导出 PNG、原始 EXR 与匿名参数报告')}</li>
          </ol>
          <p>{t('The PNG stores the displayed image. The EXR preserves the original optical depth and transmission.', 'PNG 保存显示图像，EXR 保留原始光学厚度和透射率。')}</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="xray-iteration">
      <h2 id="xray-iteration" data-thread-chapter>{t('Iteration', '设计迭代')}</h2>
      <h3>{t('A fair reference at the sphere boundary', '为体素球选对积分基准')}</h3>
      <p>{t('The sphere failed its first two acceptance runs near the edge. The analytic sphere had a sharp boundary, while trilinear interpolation gave the voxel sphere a transition band. For the third run I used the exact integral of the same interpolated voxel field as the reference. That let me measure the integration error separately.', '球体的前两轮验收都在边缘出了问题。连续球面的边界锐利，而体素球经过三线性插值后有一段过渡带。第三轮，我改用同一插值体素场的精确积分作参考，才得以单独测量积分误差。')}</p>
      <h3>{t('An independent CT preview', '隔离 CT 预览场景')}</h3>
      <p>{t('An imported CT passed validation, yet the Game view still showed the old phantom. I traced it to 18 overlapping demo-camera and display-plane setups and moved the Toolkit preview into its own scene. A second problem, a red tint on the scan, came from the display material for a single-channel texture. Mapping it to greyscale restored the image.', 'CT 已通过导入校验，Game 视图却仍然显示旧体模。我排查出有 18 套演示相机和显示平面重叠，于是把 Toolkit 预览移入独立场景。预览发红则来自单通道纹理的显示材质，改用灰度映射后恢复正常。')}</p>
      <h3>{t('A shell around a lighter core', '给长骨加上骨皮质与内芯')}</h3>
      <p>{t('I replaced uniform solid bone with a high-attenuation shell and a lower-attenuation core. Near a tangent, a ray crosses a longer stretch of dense cortex, producing a bright rim that moves as the view rotates. I estimated the shell at 3.5 mm for the femur and 3 mm for the tibia.', '我把均匀实心骨改成高衰减外壳包围低衰减内芯。射线接近骨壳切线时，会穿过更长一段致密骨皮质，于是投影出现随视角移动的亮边。股骨壳厚估为 3.5 mm，胫骨为 3 mm。')}</p>
      <Plate image="bone-cross-sections" caption={t('Left, solid bone. Right, shell and core. Both use slice Z = 305 and the same display window. The material reference also changed from 80 to 50 keV, contributing to the overall brightness difference.', '左为实心骨，右为骨皮质与内芯。两版均取 Z = 305 的同层切片并使用相同显示窗。材料参考也从 80 keV 调整为 50 keV，因此整体亮度差受两项改动影响。')} />
      <h3>{t('Exposure and windowing', '区分曝光与调窗')}</h3>
      <p>{t('After computing ideal transmission I added optional photon counting. With N₀ expected open-beam photons per pixel, the count in one exposure follows K ∼ Poisson(N₀T). A new exposure draws new counts and the grain changes. Windowing reuses the same acquisition, so I can adjust the display while holding that grain pattern fixed.', '算出理想透射率后，我加入了可选的光子计数采集。空场每像素的期望光子数为 N₀ 时，单次曝光的计数服从 K ∼ Poisson(N₀T)。重新曝光会生成新的颗粒，调窗则复用同一次采集，可以在固定颗粒分布的前提下调整显示。')}</p>
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
      <h3>{t('Checks against reference values', '用参考值检验输出')}</h3>
      <DataTable columns={[t('Check', '检验项'), t('Result', '结果')]} rows={[
        [t('Integration', '积分'), t('811 rays passed comparison with the exact voxel-field integral.', '811 条射线通过同一体素场的精确积分参考检验。')],
        [t('Geometry', '几何'), t('Predicted projected radius 40.032 mm. Both measured axes gave 40.5 mm, a difference of 0.468 pixels.', '投影球半径的解析值为 40.032 mm。横纵实测均为 40.5 mm，相差 0.468 像素。')],
        [t('Repeatability', '重复性'), t('The slab and the sphere each produced bit-identical GPU output across 100 renders.', '平板和球体分别重复渲染 100 次，各自的 GPU 输出逐位一致。')],
        [t('Browser and Unity', '网页与 Unity'), t('Across six matched 384 × 256 images at 1 mm steps, the maximum difference was one 8-bit grey level in each view.', '以相同视角、1 mm 步长比对六组 384 × 256 图像，各组最大差异均为一个 8 位灰度级。')],
        [t('Regression tests', '回归测试'), 'Unity 850/850 · Python 191/191'],
      ]} />
      <h3>{t('Does more light reduce grain?', '光子多了，颗粒会怎样？')}</h3>
      <p>{t('In a uniform field at T = 0.25, quadrupling the expected open-beam photon count approximately halved the measured relative noise on Metal.', '在 T = 0.25 的均匀场中，空场光子数增加到四倍，Metal 上实测的相对噪声约减半。')}</p>
      <DataTable columns={[t('Open-beam photons / pixel', '空场光子数 / 像素'), t('Expected relative noise', '理论相对噪声'), t('Measured on Metal', 'Metal 实测')]}
        rows={[['1,000', '6.325%', '6.316%'], ['4,000', '3.162%', '3.165%']]} />
      <h3>{t('Timing the human projection', '人体投影耗时')}</h3>
      <p>{t('On an Apple M5 Pro using Metal, I warmed up each configuration twice and timed five runs. The medians below cover allocation, projection and synchronous readback. Scene rendering and interface work are excluded from those timings.', '在 Apple M5 Pro 的 Metal 后端上，我为每档配置预热 2 次，再测量 5 次取中位数。计时覆盖分配、投影和同步读回，场景绘制与界面耗时另计。')}</p>
      <DataTable columns={[t('Resolution', '分辨率'), t('Step length', '采样步长'), t('Median time', '中位耗时')]} rows={[
        ['384 × 216', '2 mm', '1.76 ms'], ['768 × 432', '1 mm', '4.71 ms'], ['1024 × 576', '0.5 mm', '10.40 ms'],
      ]} />
      <h3>{t('Comparing projection methods', '投影方法的差异')}</h3>
      <p>{t('In my renderer, doubling the thickness of a uniform material squares its transmission. A maximum intensity projection takes the largest voxel value along each ray, so the same change in thickness leaves its peak unchanged. DiffDRR produces differentiable projections in PyTorch and can use gradients to optimise camera pose. A matched comparison with its output is a planned experiment.', '我的渲染器沿射线累积材料衰减，均匀材料厚度加倍，透射率就变为原值的平方。最大强度投影取沿途最大的体素值，同样的厚度变化会保留原来的峰值。DiffDRR 在 PyTorch 中生成可微分投影，可以用梯度优化相机位姿。与它进行同条件输出对照是我计划的后续实验。')}</p>
    </section>

    <section aria-labelledby="xray-outlook">
      <h2 id="xray-outlook" data-thread-chapter>{t('Applications & limits', '应用与局限')}</h2>
      <p>{t('Rotating the body makes skeletal overlap visible. A known phantom helps check projection geometry, while locking the view makes exposure grain easier to compare. These are teaching and engineering uses of the prototype.', '旋转人体可以展示骨骼重叠，用已知材料的体模可以检查投影几何，固定姿态则便于比较曝光颗粒。这些是原型在教学和工程研究中的用途。')}</p>
      <p>{t('The human volume uses water-equivalent soft tissue and estimated cortical shells. Lung parenchyma and trabecular bone are absent. The renderer simulates primary rays at a single energy. Scatter simulation and device calibration are still open.', '人体模型采用水等效软组织和估计厚度的骨壳，缺少肺实质和骨小梁。目前仅模拟单能直达射线，散射模拟和设备标定尚未完成。')}</p>
      <p>{t('Next I would use identical CT data and source–detector geometry in an independent digitally reconstructed radiograph renderer and map the pixel-by-pixel differences. I would also measure full-frame median and P95 times during continuous rotation, with and without photon noise.', '下一步，我想使用相同 CT 和源–探测器几何，与独立的数字重建射线影像（DRR）实现绘制逐像素误差图。我也想分别测量连续旋转时理想与含噪模式的整帧中位耗时和 P95 耗时。')}</p>
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
