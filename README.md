# cocoJune

Junyan He 的个人网站，使用 React、TypeScript 和 Vite。纯白背景、小字号、左侧两级导航与不超过 420px 的内容列。首页只保留姓名和简短介绍；当前版本仅做排版，没有插图或占位图片。

## 本地开发

推荐使用 Node.js 24（见 `.nvmrc`）。

```sh
npm ci
npm run dev
```

在浏览器中打开终端输出的地址。cocoJune 标题返回首页。EN / 中文切换覆盖主导航、二级分类、正文、项目类型与页面标题，并保留当前页面和阅读位置。语言偏好会在当前浏览器中保存；人名、项目名称和论文原标题保留原文。

```sh
npm run typecheck # TypeScript 类型检查
npm run build     # 类型检查并构建到 dist/
npm run preview   # 预览构建结果，需先运行 build
```

## 页面

| 地址                            | 内容                                            |
| ------------------------------- | ----------------------------------------------- |
| `#/`                            | 首页：姓名与一句简短介绍                        |
| `#/projects`                    | 按游戏与 XR、图形与工具、交互设计分组的文字索引 |
| `#/projects/category/:category` | 分类项目列表                                    |
| `#/projects/:id`                | 可独立访问的项目详情                            |
| `#/research`                    | 研究经历与论文 DOI 链接                         |
| `#/gallery`                     | 默认进入绘画集合                                |
| `#/gallery/drawings`            | 绘画集合                                        |
| `#/gallery/photographs`         | 摄影集合                                        |
| `#/about`                       | 简短介绍、教育、工具、联系方式与简历下载        |

使用 hash 路由，静态托管不需要单独配置页面重写。构建后的资源使用相对路径，可部署到根目录或子目录。

## 布局检查

开发时以完整桌面视口（1440×900、1920×1080）和手机视口（390×844，另检查 320px 窄屏）检查布局，不只依据侧边预览的宽度调整。

## 内容维护

- 项目、论文和联系方式：`src/data/content.ts`。
- 简历下载文件：`public/Junyan_He_CV.pdf`，内容来自提供的 2026-10-31 版本。
- 个人画廊：目前没有发布任何图片，也未使用参考网站或参考图片中的他人作品。将自己的图片放在 `public/gallery/`，再向 `galleryItems` 添加记录即可。
- 视觉样式：`src/styles/global.css`。包含桌面、平板和手机布局，以及减少动态效果的偏好支持。

画廊记录格式：

```ts
{
  id: 'a-still-afternoon',
  src: `${import.meta.env.BASE_URL}gallery/a-still-afternoon.jpg`,
  title: { en: 'A still afternoon', zh: '安静的午后' },
  alt: { en: 'Describe the image here', zh: '在这里描述图片内容' },
  category: 'photographs', // 'drawings' 或 'photographs'
}
```

项目中的在研状态与个人贡献以用户提供的简历为依据。公开上线前，按实际进度更新素材和文字即可。

## 发布

运行 `npm run build` 后，将 `dist/` 上传至静态托管平台即可。当前仓库尚未配置自动部署。
