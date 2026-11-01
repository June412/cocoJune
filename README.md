# cocoJune

Junyan He 的个人网站，使用 React、TypeScript 和 Vite。浅色封面首页，结合衬线排版、少量错落插图与手绘线条。首页只有三个入口：项目、画廊、关于。

## 本地开发

推荐使用 Node.js 24（见 `.nvmrc`）。

```sh
npm ci
npm run dev
```

在浏览器中打开终端输出的地址。中英文切换会在当前浏览器中保存；站点名称和项目名称保留英文。

```sh
npm run typecheck # TypeScript 类型检查
npm run build     # 类型检查并构建到 dist/
npm run preview   # 预览构建结果，需先运行 build
```

## 页面

| 地址             | 内容                                       |
| ---------------- | ------------------------------------------ |
| `#/`             | 封面首页：名字、简单介绍与三个入口         |
| `#/projects`     | 图片与标题组成的项目集合                   |
| `#/projects/:id` | 可独立访问的项目详情                       |
| `#/research`     | 研究经历与论文 DOI 链接                    |
| `#/gallery`      | 绘画和摄影的单一集合；有作品时支持放大查看 |
| `#/about`        | 简短介绍、教育、工具、联系方式与简历下载   |

使用 hash 路由，静态托管不需要单独配置页面重写。构建后的资源使用相对路径，可部署到根目录或子目录。

## 内容维护

- 项目、论文和联系方式：`src/data/content.ts`。
- 简历下载文件：`public/Junyan_He_CV.pdf`，内容来自提供的 2026-10-31 版本。
- 项目封面：`src/components/ProjectArtwork.tsx`。这些是为网站绘制的 SVG 概念插图，已在页面标明，并非项目运行截图；后续可替换为真实截图。
- 个人画廊：目前没有发布任何图片，也未使用参考网站或参考图片中的他人作品。将自己的图片放在 `public/gallery/`，再向 `galleryItems` 添加记录即可。
- 视觉样式：`src/styles/global.css`。包含桌面、平板和手机布局，以及减少动态效果的偏好支持。

画廊记录格式：

```ts
{
  id: 'a-still-afternoon',
  src: `${import.meta.env.BASE_URL}gallery/a-still-afternoon.jpg`,
  title: { en: 'A still afternoon', zh: '安静的午后' },
  alt: { en: 'Describe the image here', zh: '在这里描述图片内容' },
  year: '2026',
}
```

项目中的在研状态与个人贡献以用户提供的简历为依据。公开上线前，按实际进度更新素材和文字即可。

## 发布

运行 `npm run build` 后，将 `dist/` 上传至静态托管平台即可。当前仓库尚未配置自动部署。
