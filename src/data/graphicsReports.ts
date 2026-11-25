import type { Localized } from './content'

export const reportIds = ['opengl-2d-greeting-card', 'reality-link-cyber-travel'] as const
export type ReportId = typeof reportIds[number]
export const isReportId = (id: string): id is ReportId => reportIds.some(value => value === id)

export const reportIntroductions: Record<ReportId, Localized[]> = {
  'opengl-2d-greeting-card': [
    {
      en: 'For the first individual project in my university computer graphics course, the brief was to make a 2D piece using techniques from class and submit the source code with a short report. I chose to make a playable card for my university’s 20th anniversary.',
      zh: '这是我在大学计算机图形学课上的第一项个人作业。老师要求用课上学到的方法创作一件二维作品，并提交源码和简短报告。我选了学校二十周年校庆这个主题，做了一张可以玩的贺卡。',
    },
    {
      en: 'I drew the campus in C++ with OpenGL and FreeGLUT. The player feeds a pixel cat, finds it again by flashlight, then guides it to the switch that sets off the fireworks. Five rings in the stencil buffer give the flashlight a soft edge, so the buildings emerge gradually from the dark.',
      zh: '我用 C++、OpenGL 和 FreeGLUT 绘制校园。玩家先喂一只像素猫，再打着手电找到它，带它走到开关前点亮烟花。我用五层同心的模板遮罩做出手电的柔边，让建筑随光束移动一点点从黑暗里显现。',
    },
  ],
  'reality-link-cyber-travel': [
    {
      en: 'For the second individual project in the same computer graphics course, the brief shifted to 3D: build a three-dimensional work using techniques from class and submit it with the source code and a short report. I brought the cat from my 2D card into a city it could explore.',
      zh: '这是我在大学计算机图形学课上的第二项个人作业。这次老师要求用课堂上的方法创作一件三维作品，同样提交源码和简短报告。我把上一份贺卡里的猫做成立体角色，给它造了一座可以探索的城市。',
    },
    {
      en: 'Using C++, OpenGL and FreeGLUT, I built a quiet room whose monitor becomes the entrance to a neon street. As the cat walks, I move repeating street sections past it to keep the city going. The player can look through a glass road at the trains below or ride a mechanical cloud above the traffic.',
      zh: '我用 C++、OpenGL 和 FreeGLUT 搭了一间安静的房间，桌上的显示器就是通往霓虹街道的入口。猫向前走时，重复的街段从它身边移过，让有限的场景看起来一直延伸。玩家可以透过玻璃路面看地下列车，也可以骑上机械云，从车流上方看这条街。',
    },
  ],
}
