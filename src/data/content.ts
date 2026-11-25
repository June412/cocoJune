import { galleryItems } from './drawingGallery'

export type Language = 'en' | 'zh'
export type Localized = { en: string; zh: string }
export const copy = (value: Localized, language: Language) => value[language]

export type WorkCategory = 'games' | 'tools' | 'research'
export const workCategories: { id: WorkCategory; label: Localized }[] = [
  { id: 'games', label: { en: 'Games & XR', zh: '游戏与 XR' } },
  { id: 'tools', label: { en: 'Graphics & tools', zh: '图形与工具' } },
  { id: 'research', label: { en: 'Interaction', zh: '交互设计' } },
]
export type GalleryCategory = 'all' | 'character-design' | 'illustrations'
export const galleryCategories: { id: GalleryCategory; label: Localized }[] = [
  { id: 'all', label: { en: 'All', zh: '全部' } },
  { id: 'character-design', label: { en: 'Character design', zh: '角色设计' } },
  { id: 'illustrations', label: { en: 'Illustrations', zh: '插画' } },
]

export type ProjectId =
  | 'tinyroomies'
  | 'textile-toolkit'
  | 'alice'
  | 'between-sips'
  | 'perspective-freeze'
  | 'x-ray'
  | 'holdlight'
  | 'opengl-2d-greeting-card'
  | 'reality-link-cyber-travel'
export type ProjectEntry = {
  id: ProjectId
  title: string
  category: WorkCategory
}
export type Project = ProjectEntry & {
  number: string
  discipline: Localized
  period: string
  ongoing: boolean
  role: Localized
  description: Localized
  overview: Localized
  contributions: Localized[]
  tools: string[]
  note?: Localized
}

export const projects: Project[] = [
  {
    id: 'tinyroomies',
    number: '01',
    title: 'TinyRoomies',
    category: 'games',
    discipline: { en: 'Mixed reality · Game design', zh: '混合现实 · 游戏设计' },
    period: '07.2026 — Present',
    ongoing: true,
    role: { en: 'Game designer, 3D artist & developer', zh: '游戏设计 / 3D 美术 / 开发' },
    description: {
      en: 'A little workshop. Five tiny residents. A world built inside your own room.',
      zh: '一间小小的工坊，五位迷你住客，在真实房间里一起制作家具。',
    },
    overview: {
      en: 'A mixed-reality crafting game for Quest 3. Five miniature residents move into the player’s physical room, bringing furniture requests, conversations, and a reason to make things by hand.',
      zh: '一款面向 Quest 3 的混合现实手作游戏。五位迷你住客来到玩家的真实房间，通过家具委托、对话和互动，连接虚拟角色与现实空间。',
    },
    contributions: [
      {
        en: 'Integrated controller input, surface calibration, spatial mapping, anchor recovery, and depth occlusion for crafting and furniture placement.',
        zh: '整合控制器输入、表面校准、空间映射、锚点恢复与深度遮挡，支持现实空间中的制作与家具摆放。',
      },
      {
        en: 'Built mortise-and-tenon assembly checks and hammering, sanding, carving, and painting interactions with visual, audio, and haptic feedback.',
        zh: '实现榫卯的对齐、插入方向、深度与装配顺序检查，以及敲击、打磨、雕刻、涂色与视听触觉反馈。',
      },
      {
        en: 'Modeled furniture, tools, and a fold-out suitcase workshop; rigged and animated characters; connected resident requests to crafting and furniture-use animations.',
        zh: '制作家具、工具与可展开的手提箱工坊，完成角色绑定和动画，并将住客任务连接到制作流程与家具使用动画。',
      },
    ],
    tools: ['Unity', 'C#', 'Blender', 'OpenXR', 'Meta XR'],
    note: { en: 'Supervised by Nan Xiang, XJTLU.', zh: '指导老师：西交利物浦大学 Nan Xiang。' },
  },
  {
    id: 'textile-toolkit',
    number: '02',
    title: 'Textile Studio',
    category: 'tools',
    discipline: { en: 'Technical art · Tools', zh: '技术美术 · 工具' },
    period: '03.2026 — Present',
    ongoing: true,
    role: { en: 'Technical artist & graphics programmer', zh: '技术美术 / 图形程序开发' },
    description: {
      en: 'Exploring the texture of cloth, one shader and one stitch at a time.',
      zh: '从一束纱线到一块织物，用着色器和工具探索布料的质感。',
    },
    overview: {
      en: 'A set of textile authoring tools for Unity, combining fabric shaders with surface decoration workflows. Knit, corduroy, and satin materials sit alongside tools for stitches, embroidery, appliqué, and edge binding.',
      zh: '面向 Unity 的织物创作工具集，将针织、灯芯绒、缎面着色器，与缝线、刺绣、贴布和包边等表面装饰工具结合。',
    },
    contributions: [
      {
        en: 'Developed HLSL/ShaderLab fabric shaders in Unity URP, using textile references to model weave patterns and light response.',
        zh: '基于织物参考，在 Unity URP 中用 HLSL / ShaderLab 构建编织图案与光照响应。',
      },
      {
        en: 'Created editor tools for mesh-region selection, weave scale and direction, and surface decorations on static meshes.',
        zh: '开发网格区域选择、编织尺度与方向调整，以及静态网格表面装饰的编辑器工具。',
      },
      {
        en: 'Implemented reusable presets and editable layers, with export of meshes, materials, textures, and shaders.',
        zh: '实现可复用的 ScriptableObject 预设与可编辑图层，支持网格、材质、纹理与着色器导出。',
      },
    ],
    tools: ['Unity URP', 'HLSL', 'ShaderLab', 'C#'],
  },
  {
    id: 'alice',
    number: '03',
    title: 'Alice',
    category: 'games',
    discipline: { en: 'Game design · Textile interactions', zh: '游戏设计 · 织物交互' },
    period: '06.2026 — Present',
    ongoing: true,
    role: { en: 'Game designer, 3D artist & developer', zh: '游戏设计 / 3D 美术 / 开发' },
    description: {
      en: 'Mending dolls, pulling threads, and finding the stories held in small things.',
      zh: '修补玩偶，牵起线头，也慢慢发现小物件承载的故事。',
    },
    overview: {
      en: 'A desktop doll-repair game in Unity. Players repair and return customers’ dolls, discovering their stories through each request. Textile interactions and a pencil-hatched visual treatment shape the workshop.',
      zh: '一款使用 Unity 开发的桌面玩偶修复游戏。玩家修复并归还顾客的玩偶，通过每次委托发现故事；织物互动与铅笔排线的视觉表现共同构成工坊体验。',
    },
    contributions: [
      {
        en: 'Implemented needle insertion, stitch placement, and thread pulling, including position and tension checks and local fabric deformation.',
        zh: '实现穿针、落针和拉线交互，加入位置与张力检查，用可见线条和局部织物形变表现修补进度。',
      },
      {
        en: 'Applied custom textile shaders to clothing, yarn hair, and ribbons, with screen-space pencil hatching layered by luminance.',
        zh: '将自定义织物着色器应用于服装、毛线头发与丝带，并根据亮度叠加屏幕空间铅笔排线。',
      },
      {
        en: 'Created paper-textured menus, synchronized tool sounds, and time-of-day and weather variations with distinct lighting and ambience.',
        zh: '制作纸张质感菜单、同步工具音效，以及具有不同光照和环境音的昼夜与天气变化。',
      },
    ],
    tools: ['Unity', 'C#', 'Blender', 'HLSL'],
  },
  {
    id: 'between-sips',
    number: '04',
    title: 'Between Sips',
    category: 'games',
    discipline: { en: '2D game · Hand-painted worlds', zh: '2D 游戏 · 手绘场景' },
    period: '01.2026 — Present',
    ongoing: true,
    role: { en: 'Game designer, artist & developer', zh: '游戏设计 / 美术 / 开发' },
    description: {
      en: 'A hand-painted journey through information overload, tea, and a slower way of living.',
      zh: '在手绘世界中穿过信息过载，用一杯茶的时间找回生活的节奏。',
    },
    overview: {
      en: 'A hand-painted 2D narrative platformer combining Chinese tea rituals with text-based storytelling. A V-shaped level connects the downward pull of information overload with an uphill journey powered by collected focus.',
      zh: '一款结合中国茶文化与文字叙事的手绘 2D 平台游戏。V 形关卡将信息过载带来的下行过程，与消耗专注力的上行旅程连接起来。',
    },
    contributions: [
      {
        en: 'Designed a focus system in which short videos, books, and keepsakes affect the uphill journey differently while sharing a capacity limit.',
        zh: '设计专注力系统：短视频、书籍和纪念物在共享容量限制下，对上行探索产生不同影响。',
      },
      {
        en: 'Implemented a multi-stage tea-brewing system, scoring warming, pouring, decanting, and serving to unlock areas and memory clues.',
        zh: '开发多阶段泡茶系统，对温器、注水、出汤和奉茶进行加权评分，以解锁区域和记忆线索。',
      },
      {
        en: 'Created 2D art and animations in Photoshop, Procreate, Spine, and After Effects, and integrated them with cameras and interaction feedback in Unity.',
        zh: '使用 Photoshop、Procreate、Spine 和 After Effects 制作美术与动画，并在 Unity 中整合镜头和交互反馈。',
      },
    ],
    tools: ['Unity', 'Photoshop', 'Procreate', 'Spine', 'After Effects'],
  },
  {
    id: 'perspective-freeze',
    number: '05',
    title: 'Perspective Freeze',
    category: 'research',
    discipline: { en: 'VR · Interaction research', zh: '虚拟现实 · 交互研究' },
    period: '09.2026 — Present',
    ongoing: true,
    role: { en: 'Final-year project · Design & prototyping', zh: '毕业设计 / 交互设计与原型开发' },
    description: {
      en: 'Change your viewpoint. Find a shape. Make a fleeting perspective stay.',
      zh: '改变观看的位置，找到一个形状，再把转瞬即逝的视角留下。',
    },
    overview: {
      en: 'A viewpoint-driven VR interaction for Quest 3. Users reshape an object by moving their viewing position, align it with a target, and freeze the result as a persistent 3D mesh with collision support.',
      zh: '面向 Quest 3 的视角驱动 VR 交互。用户通过改变观看位置重塑物体，将其与目标对齐后，将结果冻结为具有碰撞支持的持久化三维网格。',
    },
    contributions: [
      {
        en: 'Designed and prototyped the interaction in Unity/C#, including persistent geometry and collision support.',
        zh: '在 Unity / C# 中设计并开发交互原型，实现几何体持久化与碰撞支持。',
      },
      {
        en: 'Planned a comparison with direct 3D manipulation around efficiency, accuracy, shape predictability, and physical effort.',
        zh: '计划与直接三维操控进行对比，关注任务效率、精度、形状可预测性，以及改变视角所需的身体负担。',
      },
      {
        en: 'Exploring a full VR game concept centered on perspective-based interaction.',
        zh: '正在探索以视角交互为核心的完整 VR 游戏概念。',
      },
    ],
    tools: ['Unity', 'C#', 'Quest 3'],
    note: {
      en: 'Supervised by Nan Xiang, XJTLU. Evaluation is planned; results are not yet reported.',
      zh: '指导老师：西交利物浦大学 Nan Xiang。对比评估处于计划阶段，尚未报告结果。',
    },
  },
  {
    id: 'x-ray',
    number: '06',
    title: 'Volumetric X-ray',
    category: 'tools',
    discipline: { en: 'Graphics · Compute shaders', zh: '图形 · 计算着色器' },
    period: '08.2026 — 10.2026',
    ongoing: false,
    role: { en: 'Graphics development', zh: '图形开发' },
    description: {
      en: 'Turning CT volumes into simulated X-ray projections, on the GPU.',
      zh: '用 GPU 将 CT 体数据转化为模拟 X 射线投影。',
    },
    overview: {
      en: 'A Unity/HLSL compute-shader renderer that generates simulated X-ray projections from CT volumes using cone-beam ray marching and Beer–Lambert attenuation.',
      zh: '基于 Unity / HLSL 计算着色器的渲染器，使用锥束光线步进与 Beer–Lambert 衰减，从 CT 体数据生成模拟 X 射线投影。',
    },
    contributions: [
      {
        en: 'Implemented GPU projection rendering and DICOM import.',
        zh: '实现 GPU 投影渲染与 DICOM 数据导入。',
      },
      {
        en: 'Added projection controls and image/data export.',
        zh: '加入投影参数控制，以及图像和数据导出。',
      },
      {
        en: 'Validated GPU projections against CPU calculations and synthetic volumes with known analytical solutions.',
        zh: '通过 CPU 计算以及具有已知解析解的合成体数据验证 GPU 投影。',
      },
    ],
    tools: ['Unity', 'HLSL', 'Compute shaders', 'DICOM'],
    note: { en: 'Supervised by Nan Xiang, XJTLU.', zh: '指导老师：西交利物浦大学 Nan Xiang。' },
  },
  {
    id: 'holdlight',
    number: '07',
    title: 'HoldLight',
    category: 'research',
    discipline: { en: 'Accessibility · Human–computer interaction', zh: '无障碍 · 人机交互' },
    period: '02.2026 — 03.2026',
    ongoing: false,
    role: { en: 'UI design & front-end development', zh: 'UI 设计 / 前端开发' },
    description: {
      en: 'Making climbing routes easier to understand for blind and low-vision climbers.',
      zh: '让盲人和低视力攀岩者更容易理解攀岩路线。',
    },
    overview: {
      en: 'An accessible climbing guidance system combining wall scanning, route preview, and climbing guidance. My work focused on the interface and front end, with contributions to color classification and questionnaire research.',
      zh: '一个结合岩壁扫描、路线预览与攀爬引导的无障碍攀岩系统。我主要负责界面设计和前端开发，并参与颜色分类与问卷研究。',
    },
    contributions: [
      {
        en: 'Led UI design and developed the React/TypeScript front end for scanning, preview, and guidance.',
        zh: '主导 UI 设计，使用 React / TypeScript 开发扫描、路线预览与引导的前端界面。',
      },
      {
        en: 'Contributed to hold-color classification using segmented color features, HSV rules, and a lightweight classifier.',
        zh: '参与岩点颜色分类，结合分割区域的颜色特征、HSV 规则与轻量分类器。',
      },
      {
        en: 'Contributed to questionnaire research and produced a portfolio documenting research, interface iterations, and implementation.',
        zh: '参与路线理解与引导需求的问卷研究，并整理用户研究、界面迭代和系统实现的项目作品集。',
      },
    ],
    tools: ['React', 'TypeScript', 'UI/UX', 'Accessibility'],
    note: {
      en: 'Supervised by Yue Li, XJTLU. Published at ASSETS ’26.',
      zh: '指导老师：西交利物浦大学 Yue Li。相关论文发表于 ASSETS ’26。',
    },
  },
]

export const projectIndex: ProjectEntry[] = [
  ...projects,
  { id: 'opengl-2d-greeting-card', title: 'Pixel Light Greeting Card', category: 'tools' },
  { id: 'reality-link-cyber-travel', title: 'Reality Link: Cyber Travel', category: 'tools' },
]

export const holdLightPaper = {
  id: 'P1',
  title:
    'HoldLight: Making Indoor Climbing More Accessible for Blind and Low-Vision Climbers through Layered Route Preview and Real-Time Next-Hold Guidance',
  authors: 'Chenyu Du, Junyan He, Jiafei Sun, Yue Li',
  venue: 'ACM ASSETS ’26',
  year: '2026',
  url: 'https://doi.org/10.1145/3797867.3829070',
}

export const publications = [
  holdLightPaper,
  {
    id: 'P2',
    title: 'Real-Time 3-DoF Robotic Grasp Detection via Keypoint Regression',
    authors:
      'Xiaoyu Xia, Chengcheng Hu, Leyi Liu, Junyan He, Kaiyue Chen, Yuhao Jin, Yong Yue, Xiaohui Zhu',
    venue: 'ICAC 2026',
    year: '2026',
    url: 'https://doi.org/10.1109/ICAC70325.2026.11712412',
  },
  {
    id: 'P3',
    title: 'Semantic-aware Lightweight Temporal Enhancement for Skeleton-based Action Recognition',
    authors: 'Jiayi Chu, Yuxiao Tang, Qizhong Gao, Junyan He, Xiaohui Zhu, Yong Yue',
    venue: 'ICAC 2026',
    year: '2026',
    url: 'https://doi.org/10.1109/ICAC70325.2026.11712510',
  },
]

export type GalleryItem = {
  id: string
  src: string
  width: number
  height: number
  title: Localized
  alt: Localized
  category: GalleryCategory
  layout: 'compact' | 'regular' | 'large' | 'featured'
}
export { galleryItems }
export const email = 'Junyan.He23@student.xjtlu.edu.cn'
export const github = 'https://github.com/June412'
export const cvUrl = `${import.meta.env.BASE_URL}Junyan_He_CV.pdf`
