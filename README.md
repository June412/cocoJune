# cocoJune

个人网站的基础工程，使用 React、TypeScript 和 Vite。当前首页刻意保持空白，尚未添加页面内容。

## 本地开发

推荐使用 Node.js 24（见 `.nvmrc`）。已安装 nvm 时，可先运行 `nvm use`。

```sh
npm ci
npm run dev
```

打开终端中输出的本地地址。

## 工程命令

```sh
npm run typecheck # TypeScript 类型检查
npm run build     # 类型检查并构建至 dist/
npm run preview   # 本地预览构建结果，需先运行 build
```

## 目录

```text
public/                无需编译的静态文件
src/
  assets/              通过代码导入的资源
  components/          可复用组件
  layouts/             页面布局
  pages/               页面入口
  styles/              公共样式
  App.tsx              应用结构
  main.tsx             应用挂载入口
```

首页入口是 `src/pages/HomePage.tsx`，通用布局是 `src/layouts/SiteLayout.tsx`。新增页面时再按实际需求配置路由。

构建产物使用相对资源路径，可用于根目录或子目录静态托管。当前尚未配置线上部署。

构建工具参考：[Vite 官方文档](https://vite.dev/guide/)。
