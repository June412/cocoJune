import { useLayoutEffect, useRef, type ReactNode } from 'react'
import type { Language, ProjectId } from '../data/content'
import { useSite } from '../lib/SiteContext'

type Chapter = [id: string, english: string, chinese: string, shortEnglish: string, shortChinese: string]
declare global {
  interface Window {
    ProjectThread: {
      mount(host: HTMLElement, article: HTMLElement, chapters: Chapter[], language: Language, route: string): () => void
    }
  }
}

const chapters: Partial<Record<ProjectId, Chapter[]>> = {
  holdlight: [
    ['holdlight-demo', 'Climbing demo', '攀岩演示', 'Demo', '演示'],
    ['holdlight-overview', 'Route guidance', '路线引导', 'Route', '引导'],
    ['holdlight-role', 'My contribution', '我的职责', 'Role', '职责'],
  ],
  'x-ray': [
    ['xray-overview', 'The renderer', '渲染器概览', 'Intro', '概览'],
    ['xray-models', 'Model studies', '模型观察', 'Models', '模型'],
    ['xray-film', 'Demo film', '运行演示', 'Film', '演示'],
    ['xray-research', 'Making the renderer', '渲染过程', 'Build', '制作'],
    ['xray-showcase', 'Projection studies', '投影对照', 'Views', '投影'],
    ['xray-validation', 'Validation', '验证与性能', 'Tests', '验证'],
    ['xray-outlook', 'Limits & sources', '局限与资料', 'Notes', '资料'],
  ],
  'opengl-2d-greeting-card': [
    ['project-film', 'Greeting card', '互动贺卡', 'Film', '贺卡'],
    ['system', 'How it works', '系统设计', 'System', '系统'],
    ['cover', 'Cover scene', '封面场景', 'Cover', '封面'],
    ['campus', 'Campus & light', '校园与灯光', 'Light', '灯光'],
    ['fireworks', 'Fireworks', '烟花庆典', 'Sparks', '烟花'],
    ['text', 'Text & hints', '文字与提示', 'Text', '文字'],
    ['limits', 'Limitations', '局限与改进', 'Limits', '改进'],
  ],
  'reality-link-cyber-travel': [
    ['project-film', 'Cyber Travel', '游戏演示', 'Film', '演示'],
    ['controls', 'Player controls', '玩家操作', 'Play', '操作'],
    ['architecture', 'Scene design', '场景设计', 'Scenes', '场景'],
    ['city', 'Cyberpunk city', '赛博城市', 'City', '城市'],
    ['conclusion', 'Reflections', '项目总结', 'Notes', '总结'],
  ],
  'between-sips': [
    ['overview', 'The tea journey', '茶与关卡', 'Intro', '概览'],
    ['mechanics', 'Focus & brewing', '专注力与泡茶', 'Play', '玩法'],
    ['production', 'Art & animation', '美术与动画', 'Art', '美术'],
  ],
  'perspective-freeze': [
    ['overview', 'Viewpoint interaction', '视角交互', 'Intro', '概览'],
    ['mechanics', 'The VR prototype', '交互原型', 'Build', '原型'],
    ['production', 'Planned evaluation', '评估计划', 'Study', '评估'],
  ],
}

export default function ProjectReader({ id, children }: { id: ProjectId; children: ReactNode }) {
  const { language } = useSite()
  const host = useRef<HTMLDivElement>(null)
  const article = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (host.current && article.current && chapters[id])
      return window.ProjectThread.mount(host.current, article.current, chapters[id], language, '#/projects/' + id)
  }, [id, language])
  return <div className="thread-layout">
    <div ref={host} className="thread-host" />
    <div ref={article} className="thread-copy">{children}</div>
  </div>
}
