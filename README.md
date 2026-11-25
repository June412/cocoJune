# Junyan He

Junyan He 的个人网站，使用 React、TypeScript 和 Vite。淡黄色背景、可可棕色文字、孔雀蓝正文链接，以及大写单行姓名 JUNYAN HE 和居中的两级导航。主导航和分类导航没有下划线，默认可可棕色，悬停或选中时变为孔雀蓝。首页按“自我介绍 → 手绘链接列表”排列，包含项目、GitHub、CV、研究、画廊和邮箱入口。点击 JUNYAN HE 返回首页，不再提供独立 About 页面。项目区域宽度不超过 800px，首页不超过 760px，研究页不超过 640px。

项目采用“左边小录屏 → 中间项目名 → 右边手绘”的三列方式，中间是项目名和入口链接。Alice 和 Textile Studio 共用一个作品集首页；HoldLight 和两篇图形学作业也可进入站内详情页。手机上改为录屏在上、名字和小画在下。当前七张角色线稿为根据用户提供的角色与笔触参考生成的透明 PNG，后续可替换为作者自己的手绘；没有录屏的项目显示明确的待补充占位，没有使用参考网站的游戏素材。

## 本地开发

无需启动服务器时，双击项目根目录的 `Junyan-He.html` 即可浏览网站。这个文件使用同目录的 `public/` 图片、字体、视频和 CV，请把 HTML 与 `public/` 放在一起。修改源码或录屏路径后，运行 `npm run build:html` 重新导出，再刷新打开的 HTML；此版本不依赖 localhost。项目链接、页面切换和录屏预览均保留。

推荐使用 Node.js 24（见 `.nvmrc`）。

```sh
npm ci
npm run dev
```

在浏览器中打开终端输出的地址。JUNYAN HE 标题返回首页。EN / 中文切换覆盖主导航、二级分类、正文、项目类型与页面标题，并保留当前页面和阅读位置。语言偏好会在当前浏览器中保存；人名、项目名称和论文原标题保留原文。

```sh
npm run typecheck # TypeScript 类型检查
npm run build     # 类型检查并构建到 dist/
npm run preview   # 预览构建结果，需先运行 build
```

## 页面

| 地址                            | 内容                                            |
| ------------------------------- | ----------------------------------------------- |
| `#/`                            | 自我介绍、手绘链接列表、联系方式与简历下载       |
| `#/projects`                    | 按游戏与 XR、图形与工具、交互设计分组的图文索引 |
| `#/projects/category/:category` | 分类项目列表                                    |
| `#/projects/tinyroomies` | TinyRoomies 完整案例、短片、工具和家具模型 |
| `#/projects/tinyroomies/design-document` | TinyRoomies 英文游戏设计文档 |
| `#/projects/tinyroomies/joinery` | TinyRoomies 中文榫卯调研 |
| `#/projects/alice`              | Textile Studio & Alice 联合首页、项目短片和制作署名 |
| `#/projects/textile-toolkit`    | Textile Studio 工具案例、工作台、作品与使用测试 |
| `#/projects/alice/:chapter`     | 兼容旧书签，定位至新版游戏案例的相应章节或英文技术详解 |
| `#/projects/holdlight`          | HoldLight 项目介绍、演示、在线作品集、海报与论文  |
| `#/projects/x-ray`              | Volumetric X-ray 项目回顾，可旋转的 X 光投影、透明人体和带章节的 Unity 实录 |
| `#/projects/:id`                | 有报告的作品打开报告，其余旧地址转到项目分类       |
| `#/research`                    | 研究经历与论文 DOI 链接                         |
| `#/gallery`、`#/gallery/all`    | 全部作品                                        |
| `#/gallery/character-design`    | 角色设计                                        |
| `#/gallery/illustrations`       | 插画，包含数字绘画和纸上手绘                     |
| `#/about`                       | 兼容旧地址，自动跳转至 `#/` 首页                 |

使用 hash 路由，静态托管不需要单独配置页面重写。构建后的资源使用相对路径，可部署到根目录或子目录。

「游戏与 XR」里的 Alice 打开联合首页。「图形与工具」里的 Textile Studio 可直达工具案例。首页、两篇连续阅读的双语案例、两篇英文技术详解及素材位于 `public/projects/alice/`。内容沿用作者更新后的原站，包括 77 秒分章短片、中英文字幕、制作署名、交互演示与可下载的 Mac 试玩包。个人站适配使用同目录的 `personal-shell`、`personal-theme` 和 `personal-media` 文件；全站导航样式共用 `public/styles/site-chrome.css`。正文使用 720px 阅读栏，各页的 `personal-*-layout.css` 单独设置图像、演示与工作台的宽幅布局，最宽可展开到 1240px。游戏使用蓝色缝线，布艺工具使用红色缝线。模型和材质球以透明背景展示。部分 Unity 渲染自带纯色背景，网页使用与原机位一致的轮廓遮罩；界面和场景截图按原图展示。试玩 ZIP 由 Git LFS 管理。

## 布局检查

开发时以完整桌面视口（1440×900、1920×1080）和手机视口（390×844，另检查 320px 窄屏）检查布局，不只依据侧边预览的宽度调整。

链接采用孔雀蓝实线下划线，悬停时加深；缺少目标地址的项目以点状下划线标明待补充，不提供空链接。录屏预览保持静止，不做悬停放大或浮起；Alice、Between Sips、Textile Toolkit、X-ray 与 HoldLight 在鼠标移入时静音自动播放，其中 Alice 和 HoldLight 的封面也可进入站内详情页。系统开启减少动态效果时不自动播放。页面切换采用短暂淡入，页首保留分类导航的空间；语言切换保留阅读位置。系统开启“减少动态效果”时关闭过渡与动画。

## 项目手绘编排

所有已接入录屏的可见窗口统一额外等比例放大 3%，让画面贴到缝线下方。该设置位于 `global.css` 的 `.project-preview--hover-video .project-preview-media`，独立于缝线框尺寸和各项目原有的内部裁剪、缩放参数。

除 HoldLight 攀岩角色外，其余六张项目插画统一在原显示尺寸上放大 1.2 倍，桌面和手机端均生效。HoldLight 保留现有尺寸。

全部项目在 Works 里按分类显示录屏位置、项目名称和线稿。TinyRoomies、Alice、Textile Toolkit 和 HoldLight 参考用户提供的角色形象；Between Sips 只用茶杯；取景框小人、切片方块是为对应项目设计的示意角色。

| 项目 | 当前角色线稿 | 可以留给后续的小动作 |
| --- | --- | --- |
| TinyRoomies | 戴眼镜的多肉盆栽住客，正迈步向前 | 叶片晃动、探头 |
| Alice | 用户选定的简洁兔耳破损布娃娃，整体倾斜，旁边放着针线 | 保持静止 |
| Between Sips | 单独一杯热茶 | 茶气缓慢升起 |
| Textile Toolkit | 圆背上插着球头缝纫针的小刺猬针插 | 轻轻迈步 |
| Perspective Freeze | 透过取景框看方块的小人 | 方块短暂改变透视 |
| X-ray | 单脚踮起、举手扶住摇晃切片的小方块 | 切片轻轻错开 |
| HoldLight | 沿竖直墙线抓踩岩点的小攀岩者，显示尺寸放大 50% | 下一枚岩点亮起 |

角色线稿使用内置 image_gen 生成，原图保存于 `public/illustrations/`。Alice 当前使用 v7：直接采用用户于 2026-11-14 选定并重新上传的 PNG，保留简洁轮廓、头与身体对齐的整体倾斜姿态，保持静止。Textile Toolkit 使用 v3 针插刺猬；HoldLight 使用 v2，保留原角色姿势并加墙线、四个岩点，显示尺寸放大 50%。Between Sips 使用 v3，多肉和切片方块使用 v2，取景框小人使用 v1；旧版原图保留供对比。逐张完整提示词与来源记录见 `output/imagegen/project-character-prompts*.json`，Alice 的前期简化与姿态调整记录见 `output/imagegen/alice-minimal-prompts.json` 和 `output/imagegen/alice-aligned-prompts.json`；11 月 14 日的三张生成修订见 `output/imagegen/project-characters-nov14-prompts.json`。PNG 保留原始透明通道，背景和角色内部留白均可透出网页底色。

后续自己重画时，建议使用透明底 PNG（约 600×600）或 SVG，可可棕色（`#5B4035`）线条、少量实心细节，不用画进项目名称。周围留一点空白，保证缩到桌面 104px、手机 64–80px 时仍然看得清。画风可以保留手抖和不对称，统一线条粗细即可。

把手绘放在 `public/illustrations/`，真实项目录屏和封面放在 `public/projects/`。在 `src/data/projectVisuals.ts` 对应项目中添加路径：

```ts
alice: {
  illustration: 'illustrations/alice.png',
  video: 'projects/alice.mp4',
  cover: 'projects/alice.jpg', // 可选封面
  // 有实际网址后添加，不填时显示待补充位置：
  // link: { href: '你的实际项目网址', label: { en: 'Check it out!', zh: '看看这个项目' } },
  illustrationAlt: { en: 'Your drawing description', zh: '描述你实际画的内容' },
  coverAlt: { en: 'Your project capture description', zh: '描述实际项目画面' },
},
```

素材可以分别添加：没有 `illustration` 时显示构图草案；有 `video` 时播放录屏，`cover` 作为可选封面；只有 `cover` 时显示静帧；都没有时显示录屏待补充。建议录制 6–12 秒、横向 960×600 的 MP4（H.264）或 WebM，小画面中只展示一个核心动作。视频可以用 `previewBorder: 'red' | 'blue' | 'yellow'` 选择生成的手工缝线边框，已为项目预先轮换配置；当前 HoldLight 使用红色，录屏固定放大 1.2 倍，缝线框使用 1.03 倍微调，长针脚向视频内外延伸以连接页面背景。配置一次即可用于全部项目列表和分类项目列表；在 `src/data/projectVisuals.ts` 的项目配置中，改 `previewScale` 调外框整体尺寸，改 `previewVideoZoom` 在固定外框内等比例放大视频（例如 Alice 为 `1.3`），改 `previewVideoCrop` 按 `{ top, right, bottom, left }` 分别裁边百分比，改 `previewBorderScale` 调缝线框尺寸，1 表示原尺寸。HoldLight 右侧线稿固定放大 1.5 倍。

网站背景使用内置 image_gen 生成的浅色褶皱麻布纹理 `public/textures/wrinkled-linen-v1.png`，以低对比度重复铺满页面，让淡黄色底色保留手工织物的触感。红、蓝、黄色缝线统一使用 `public/borders/knit-border-{color}-v4.png`：针脚比旧版更明显；按反馈缩短到 v3 的约 65%，变细，红色略加深，蓝黄保持明亮，保持透明背景。CSS 按各图的缝线位置校准边距，让长针脚跨过视频边缘，同时保持各项目尺寸一致。当前版本的完整 image_gen 提示词、原图与输出路径见 `output/imagegen/moderate-stitches-nov15.json`；旧版素材和记录保留。Textile Toolkit 使用 `public/projects/textile-toolkit-preview.mp4`，通过 `previewVideoFit: 'cover'` 将 1216×720 画面等比例填满 16:9 预览，仅裁去上下少量画面。

## 字体

两篇 Computer Graphics 作业的页首作品名和报告一级章节标题（如 Introduction）使用手绘字体 Cardenio Modern Bold。英文章节小标题（如 A. Intro）、项目介绍、正文、表格与图注使用本地可变字体 Alegreya，保留 17px 正文字号和 1.7 倍行高。中文介绍保持原有字体。授权文件为 `public/fonts/Alegreya-OFL.txt`。

英文采用 Adam Gryu 网站所用字体的 **Cardenio Modern Bold**，作者 Nils Cordes。项目名和首页链接句子以 30px 为基准，行高 1.5；中文采用系统中文字体，并使用更适合中文阅读的字号。字体从作者的 [DaFont 页面](https://www.dafont.com/cardenio-modern.font) 下载，并以原文件本地加载，无外部字体请求。保留字体包内 `public/fonts/Cardenio Modern License.txt`，页脚展示作者和许可链接。字体未修改。

## 配色与首页

- 淡黄色背景：`#FFF8E8`。
- 可可棕色正文与线稿：`#5B4035`。
- 孔雀蓝链接：`#007697`，悬停为 `#005C78`。
- 首页使用“小手绘 → 一句话 → 带下划线的链接”，包括项目、GitHub、CV、研究、画廊、邮箱。
- 简介加入 “You can also call me June.”；英文简介使用支持真正小写字形的 Patrick Hand，保留正常的句首及专有名词大写。姓名 JUNYAN HE 使用原来的 Cardenio Modern 粗体，标题、导航和链接列表也沿用 Cardenio Modern。Patrick Hand 从 Google Fonts 官方字体服务下载，本地文件与 OFL 许可证位于 `public/fonts/PatrickHand-Regular.ttf`、`public/fonts/PatrickHand-OFL.txt`；来源与作者见 https://github.com/google/fonts/tree/main/ofl/patrickhand 。
- HoldLight 的项目入口打开站内介绍页，论文 DOI 可在研究页的发表列表中找到。
- 在 `src/data/aboutLinks.ts` 中编辑文案与链接；给条目添加 `illustration: 'illustrations/about-cv.png'` 即可替换占位图标。建议透明底 400×400 PNG 或 SVG，显示尺寸约 54–76px。
- 六枚首页小图标分别是手柄、猫咪电脑、简历纸张、书本、画笔、爱心信封，已按项目插画的粗线笔触绘制，并统一显示为可可棕色。透明 PNG 保存于 `public/illustrations/home-*-line-v1.png`，完整内置 image_gen 提示词及修订记录见 `output/imagegen/home-icon-prompts.json`；`src/components/AboutIllustration.tsx` 中的旧 SVG 仍作为未配置图片时的备用草图。

## 内容维护

两份图形学作业分别在 `public/projects/reports/card/` 和 `public/projects/reports/travel/` 保存录屏。`preview.mp4` 是列表悬停短片，`demo.mp4` 是详情页完整演示，两者都不含音轨。更换视频时同步更新同名 JPG 封面，并在 `src/data/projectVisuals.ts` 填入实际宽高比；`previewBorder` 决定两个位置的缝线颜色。所有站内项目详情页使用同一个手绘播放按钮，初始暂停。

两份图形学作业的标题只显示作品名，不加课程或作业序号。列表标题为纯文字，访客通过预览或“阅读项目报告”进入详情页。演示视频后先用第一人称区分课程要求和个人设计，再引出报告。报告从摘要或引言开始，保留原文、图表和图注；不展示提交封面、学号和学校邮箱，也不要把含这些信息的原件放进公开资源目录。

- 项目、论文和联系方式：`src/data/content.ts`。
- 项目插画、录屏与封面：`src/data/projectVisuals.ts`；临时线稿：`src/components/ProjectIllustration.tsx`。
- 简历下载文件：`public/Junyan_He_CV.pdf`，内容来自提供的 2026-10-31 版本。
- 个人画廊的图片位于 `public/drawings/`，作品记录位于 `src/data/drawingGallery.ts`。
- 视觉样式：`src/styles/global.css`。包含桌面、平板和手机布局，以及减少动态效果的偏好支持。

画廊记录格式：

```ts
{
  id: 'a-still-afternoon',
  src: 'drawings/illustrations/a-still-afternoon.jpg',
  width: 2400,
  height: 1800,
  title: { en: 'A still afternoon', zh: '安静的午后' },
  alt: { en: 'Describe the image here', zh: '在这里描述图片内容' },
  category: 'illustrations', // 'illustrations' 或 'character-design'
  layout: 'regular',
}
```

项目中的在研状态与个人贡献以用户提供的简历为依据。公开上线前，按实际进度更新素材和文字即可。

## 发布

运行 `npm run build` 后，将 `dist/` 上传至静态托管平台即可。当前仓库尚未配置自动部署。
