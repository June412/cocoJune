import { publications, type Localized, type ProjectId } from './content'

export type ProjectVisual = {
  // Paths are relative to public/, e.g. 'illustrations/alice.png'.
  illustration?: string
  video?: string
  // Hover previews wait for the pointer before playing and stay non-interactive.
  hoverPlay?: boolean
  // Video scale knob. Change this number (1 = base size, 1.2 = 20% larger).
  previewScale?: number
  // Independent crop knobs for the video content; values are percentages per edge.
  previewVideoCrop?: { top?: number; right?: number; bottom?: number; left?: number }
  // Uniform zoom for the video inside a fixed-size preview frame; preserves the video's proportions.
  previewVideoZoom?: number
  // Fill the common frame without stretching when a source has a different aspect ratio.
  previewVideoFit?: 'contain' | 'cover'
  // Border scale knob. This is independent from the video scale.
  previewBorderScale?: number
  // Match the source video's frame so the sewn border hugs the actual video edge.
  previewAspect?: '16 / 9' | '8 / 5'
  // Hand-stitched preview frame; assign a different colour per video.
  previewBorder?: 'red' | 'blue' | 'yellow'
  // A still image can also serve as the video's poster.
  cover?: string
  // Use an actual project/game/repository URL; unset links keep a visible placeholder.
  link?: { href: string; label: Localized }
  illustrationAlt: Localized
  coverAlt: Localized
}

// Generated character studies can be replaced with the author's own drawings.
// Unset illustration paths fall back to the original inline composition studies.
export const projectVisuals: Record<ProjectId, ProjectVisual> = {
  tinyroomies: {
    illustration: 'illustrations/tinyroomies-line-v2.png',
    previewBorder: 'red',
    illustrationAlt: { en: 'A bespectacled succulent-pot resident eagerly stepping forward', zh: '戴眼镜的多肉盆栽住客正好奇地迈步向前' },
    coverAlt: { en: 'TinyRoomies mixed-reality workshop', zh: 'TinyRoomies 混合现实工坊' },
  },
  alice: {
    illustration: 'illustrations/alice-line-v7.png',
    video: 'projects/alice-preview.mp4',
    hoverPlay: true,
    previewScale: 1.2, // 外框尺寸与 HoldLight 一致
    previewBorderScale: 1.03, // 外框尺寸与 HoldLight 一致
    previewAspect: '16 / 9',
    previewVideoCrop: { top: 1.5, right: 0, bottom: 1.5, left: 0 },
    previewVideoZoom: 1.3, // 只放大 Alice 视频内容，保持比例并在框内裁边
    previewBorder: 'blue',
    illustrationAlt: { en: 'A simple damaged bunny-eared cloth doll tilted diagonally, with a needle and thread beside her', zh: '整体倾斜的简洁兔耳破损布娃娃，针线放在旁边' },
    coverAlt: { en: 'Alice doll-repair workshop', zh: 'Alice 玩偶修复工坊' },
  },
  'between-sips': {
    illustration: 'illustrations/between-sips-line-v3.png',
    video: 'projects/between-sips-preview.mp4',
    hoverPlay: true,
    previewScale: 1.2,
    previewBorderScale: 1.03,
    previewAspect: '16 / 9',
    previewVideoCrop: { top: 1.5, right: 0, bottom: 1.5, left: 0 },
    previewBorder: 'yellow',
    illustrationAlt: { en: 'A simple cup of hot tea with two curls of steam', zh: '一杯冒着两缕热气的茶' },
    coverAlt: { en: 'The hand-painted world of Between Sips', zh: 'Between Sips 的手绘世界' },
  },
  'textile-toolkit': {
    illustration: 'illustrations/textile-toolkit-line-v3.png',
    video: 'projects/textile-toolkit-preview.mp4',
    hoverPlay: true,
    previewScale: 1.2,
    previewBorderScale: 1.03,
    previewAspect: '16 / 9',
    previewVideoFit: 'cover',
    previewVideoCrop: { top: 1.5, right: 0, bottom: 1.5, left: 0 },
    previewBorder: 'red',
    illustrationAlt: { en: 'A little hedgehog pincushion with five round-headed sewing pins on its back', zh: '圆背上插着五根球头缝纫针的小刺猬针插' },
    coverAlt: { en: 'Textile Toolkit materials and authoring tools', zh: 'Textile Toolkit 的织物材质与创作工具' },
  },
  'perspective-freeze': {
    illustration: 'illustrations/perspective-freeze-line-v1.png',
    previewBorder: 'blue',
    illustrationAlt: { en: 'A small figure looking at a cube through a frame', zh: '透过取景框看方块的小人' },
    coverAlt: { en: 'Perspective Freeze VR interaction', zh: 'Perspective Freeze 的 VR 交互' },
  },
  'x-ray': {
    illustration: 'illustrations/x-ray-line-v2.png',
    video: 'projects/x-ray-preview.mp4',
    hoverPlay: true,
    previewScale: 1.2,
    previewBorderScale: 1.03,
    previewAspect: '16 / 9',
    previewVideoCrop: { top: 1.5, right: 0, bottom: 1.5, left: 0 },
    previewBorder: 'blue',
    illustrationAlt: { en: 'A little cube balancing on one foot and holding up its wobbling cross-section slices', zh: '单脚踮起、举手扶住头顶摇晃切片的小方块' },
    coverAlt: { en: 'Volumetric X-ray rendering', zh: '体数据 X 射线渲染' },
  },
  holdlight: {
    illustration: 'illustrations/holdlight-line-v2.png',
    video: 'projects/holdlight-preview.mp4',
    hoverPlay: true,
    previewScale: 1.2, // 调视频尺寸：改这里，例如 1.1 / 1.25
    previewBorderScale: 1.03, // 调缝线框尺寸：改这里
    previewVideoCrop: { top: 1.5, right: 0, bottom: 1.5, left: 0 }, // 按边裁剪百分比，不会拉伸
    previewAspect: '16 / 9',
    previewBorder: 'red',
    link: { href: publications[0].url, label: { en: 'Read the paper!', zh: '阅读论文' } },
    illustrationAlt: { en: 'A little climber gripping four holds beside a vertical wall line', zh: '沿着竖直墙线攀爬、手脚抓踩四个岩点的小攀岩者' },
    coverAlt: { en: 'HoldLight climbing route guidance', zh: 'HoldLight 攀岩路线引导' },
  },
}

export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

export const previewBorderUrl = (border: NonNullable<ProjectVisual['previewBorder']>) =>
  assetUrl(`borders/knit-border-${border}-v4.png`)
