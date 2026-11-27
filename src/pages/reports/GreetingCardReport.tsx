import { useSite } from '../../lib/SiteContext'
import ReportFigure from './ReportFigure'
import { GameStateDiagram, SystemOverviewDiagram } from './GreetingCardDiagrams'

export default function GreetingCardReport() {
  const { t } = useSite()
  return <>
    <h2 id="abstract" data-thread-chapter>{t("Abstract", "摘要")}</h2>
    <p>{t("This project presents a 2D interactive greeting card celebrating the 20th Anniversary of Xi’an Jiaotong–Liverpool University (XJTLU). Built with OpenGL FreeGLUT, it combines animation, interaction, and visual design to create a playful yet elegant scene. The design focuses on smooth transitions between stages, pixel-style graphics, and layered rendering effects such as soft lighting, dynamic clouds, and fireworks. Through simple controls, users can explore the campus environment and experience a lively celebration atmosphere.", "这张二维互动贺卡为西交利物浦大学二十周年而作。我用 OpenGL 和 FreeGLUT 将动画、交互与像素画面串成校园游览。玩家从封面进入校园，移动柔光手电寻找小猫，最后在流动的云和彩色烟花下庆祝校庆。")}</p>
    <h2 id="introduction" data-thread-chapter>{t("1. Introduction", "1. 项目介绍")}</h2>
    <p>{t("This project is a 2D interactive greeting card system themed around the 20th Anniversary of Xi’an Jiaotong-Liverpool University (XJTLU). The main objective of the project is to implement a greeting card that integrates animation, interaction, and multi-scene transitions within the FreeGLUT environment.", "我想在 FreeGLUT 中做一张可以玩的校庆贺卡，把动画、玩家操作与多场景切换放进同一个程序。")}</p>
    <p>{t("My card is designed with three main stages (or scenes): the Cover, the Campus, and the Celebration(The viewport in the third scene is larger), which are controlled by the global state variable gStage in coordination with time. The following sections first present the README of the system,which includes explanations of some code functions, interaction instructions, and key state transitions, followed by the design and transitions of the three scenes are discussed in detail. Subsequently, the hint system are described. Finally, the report concludes with a summary of the existing issues and potential improvements of the code.", "贺卡分为封面、校园和庆典三个阶段，庆典阶段会展开更大的视野。全局状态 gStage 与计时共同控制切换。下文先交代函数、操作和状态，再拆解三个场景、提示系统以及当前实现的局限。")}</p>
    <h2 id="system" data-thread-chapter>{t("2. System Overview (README)", "2. 系统概览（README）")}</h2>
    <p>{t("To provide a quick visual reference of the system layout, figure 1 illustrates the overall composition used in the README.", "图 1 展示了程序入口、回调与视图之间的关系。")}</p>
    <div className="study-spread">
      <div>
        <h3>{t("2.1. Overview", "2.1 系统组成")}</h3>
        <p>{t("The card runs three scenes from one FreeGLUT and OpenGL source file.", "贺卡在一个源文件内使用 FreeGLUT 和 OpenGL 实现，包含三个场景。")}</p>
        <ol className="project-process" aria-label={t("Card scenes", "贺卡场景")}>
          <li><strong>{t("Cover", "封面")}</strong><span>{t("The cat walks under starbursts, flags and balloons. The cursor becomes a fish.", "小猫在星光、彩旗和气球下来回走动，鼠标变成一条鱼。")}</span></li>
          <li><strong>{t("Campus", "校园")}</strong><span>{t("Move the cat past campus buildings beneath a striped sky and flat-bottomed clouds. Five stencil layers soften the flashlight beam.", "条带天空和平底云下，玩家控制小猫穿过校园建筑。五层模板让手电光束的边缘变柔和。")}</span></li>
          <li><strong>{t("Celebration", "庆典")}</strong><span>{t("Fireworks and coloured particles surround the double-stroked title.", "烟花与彩色粒子围绕着双描边标题。")}</span></li>
        </ol>
        <p>{t("The cover fades to black before the campus appears.", "封面淡出到黑色，再淡入校园。")}</p>
      </div>
      <SystemOverviewDiagram />
    </div>
    <h3>{t("2.2. Code Map (Functions & Data)", "2.2 函数与数据结构")}</h3>
    <p>{t("Only core interfaces are listed below, for details, refer to functions with the same names in the source code.", "这里只列出核心接口，具体实现可在源码中按函数名查找。")}</p>
    <ul>
      <li>{t("Config & State: window size, color palette, camera and light parameters, AppStage, GameState, input states, and time accumulators.", "配置与状态：窗口尺寸、配色、镜头与灯光参数、AppStage、GameState、输入状态和累计时间。")}</li>
      <li>{t("Utils: helper functions such as currentOrthoBounds, clampf, lerp, smooth01, easeInOut, hash.", "通用函数：currentOrthoBounds、clampf、lerp、smooth01、easeInOut 和 hash 等。")}</li>
      <li>{t("Primitives: drawing rectangles, lines, circles, and ellipse fans.", "基础图形：矩形、线段、圆和椭圆三角扇。")}</li>
      <li>{t("Reusable Widgets: flag banners, buttons, dialogue bubbles, and hint labels.", "可复用组件：旗串、按钮、对话气泡和提示标签。")}</li>
      <li>{t("Backdrop & Grass: drawSkyGradientAndDots, drawGrassTufts, drawExtendedBackdrop.", "背景与草地：drawSkyGradientAndDots、drawGrassTufts、drawExtendedBackdrop。")}</li>
      <li>{t("Clouds: drawCloudBlob, drawCloudCluster, drawCloudsClustersFlat (with stencil clipping and triple-layer transitions).", "云：drawCloudBlob、drawCloudCluster、drawCloudsClustersFlat，结合模板裁切和三层过渡。")}</li>
      <li>{t("Campus: stripe blocks, glass connectors, window grids, platforms, main/left/landmark/gym buildings, stone monument + flag combinations.", "校园：条带色块、玻璃连廊、窗格、台阶、主要楼宇、体育馆，以及石碑与旗帜的组合。")}</li>
      <li>{t("Cat & Lantern: drawHero, drawLantern.", "小猫与灯笼：drawHero、drawLantern。")}</li>
      <li>{t("Soft Lamp: writeLampToStencil5 (writes stencil regions); drawBlackCoversSoft5 (applies layered blackout by stencil).", "软光灯：writeLampToStencil5 写入模板区域；drawBlackCoversSoft5 按模板分层遮黑。")}</li>
      <li>{t("Particles & Fireworks: Rocket, Particle, tail emission emitTrail, burst emission emitBurst, periodic spawning spawnFireworkBurst, updating and drawing with updateParticles and drawParticles.", "粒子与烟花：Rocket 和 Particle 保存状态，emitTrail 生成尾迹，emitBurst 生成爆点，spawnFireworkBurst 周期性发射，updateParticles 和 drawParticles 更新并绘制。")}</li>
      <li>{t("Cover Scene: drawCoverBackgroundRadial, drawCoverPixelTitle_Trapezoid, drawFishCursorAtMouse, drawCoverScene; transition handled in the COVER branch of display().", "封面：drawCoverBackgroundRadial、drawCoverPixelTitle_Trapezoid、drawFishCursorAtMouse 和 drawCoverScene；转场由 display() 的 COVER 分支处理。")}</li>
      <li>{t("Update: updateHero, updateStateMachine, onIdle (controls cover cat movement, pause, and timing for scene transitions).", "更新：updateHero、updateStateMachine 与 onIdle 负责小猫移动、停顿及场景切换计时。")}</li>
      <li>{t("Display: routes rendering by AppStage and overlays hints, dialogues, and titles.", "显示：按 AppStage 选择渲染分支，最后叠加提示、对话和标题。")}</li>
    </ul>
    <h3>{t("2.3. Interaction & State Machine", "2.3 交互与状态机")}</h3>
    <p>{t("Figure 2 and table 1 summarize the control mapping and state progression.", "图 2 和表 1 分别梳理状态推进和玩家按键。")}</p>
    <GameStateDiagram />
    <h3>{t("Controls", "操作方式")}</h3>
    <div className="report-table"><table>
      <caption>{t("Table 1 User Controls", "表 1 · 玩家操作")}</caption>
      <thead><tr><th scope="col">{t("Scene", "场景")}</th><th scope="col">{t("How to Operate", "操作")}</th></tr></thead>
      <tbody>
        <tr><td>{t("Cover", "封面")}</td><td>{t("Left-click — Feed the fish to the cat.", "鼠标左键：把鱼喂给小猫。")}</td></tr>
        <tr><td>{t("Main", "校园")}</td><td>{t("Move the mouse — Shine the light to find the cat.", "移动鼠标：用光照亮画面，寻找小猫。")}<br />{t("W / A / S / D — Move the character.", "W / A / S / D：移动角色。")}<br />{t("SPACE — Pull the switch.", "空格：拉动开关。")}<br />{t("Q — Exit after celebration.", "Q：庆典后退出。")}</td></tr>
      </tbody>
    </table></div>
    <h3>{t("Cover Scene:", "封面操作")}</h3>
    <ul>
      <li>{t("Left-click: feed the fish treat to the cat (activates the cover hint).", "左键喂鱼，触发封面提示。")}</li>
    </ul>
    <h3>{t("Main Scene:", "主场景操作")}</h3>
    <ul>
      <li>{t("Mouse movement (SEARCHING): moves the flashlight center to find the cat.", "寻找阶段（SEARCHING）：移动鼠标控制手电中心，寻找小猫。")}</li>
      <li>{t("W/A/S/D or Arrow keys: control the character in the GUIDING or AT_SWITCH state.", "引导或抵达开关阶段：用 W/A/S/D 或方向键移动角色。")}</li>
      <li>{t("SPACE: triggers the switch during AT_SWITCH, entering the celebration stage.", "AT_SWITCH 阶段按空格拉动开关，进入庆典。")}</li>
      <li>{t("Q: after 5 seconds in celebration, displays the “Press Q to exit ” hint.", "庆典开始五秒后，屏幕提示按 Q 退出。")}</li>
    </ul>
    <h3>{t("Application Stages", "程序阶段")}</h3>
    <p>{t("AppStage:COVER → AppStage::MAIN (black transition lasting about 2 seconds, defined by COVER_TRANS_TOTAL).", "AppStage 从 COVER 切换至 MAIN；黑场过渡时长约两秒，由 COVER_TRANS_TOTAL 指定。")}</p>
    <h3>{t("2.4. Frame Composition", "2.4 每帧绘制顺序")}</h3>
    <ul>
      <li>{t("COVER Scene: background (starburst) → flags → pixel title “20th” → cat & balloons → fish cursor → hint overlay → black fade transition.", "封面：星光背景 → 彩旗 → 像素标题“20th” → 小猫与气球 → 鱼形光标 → 提示 → 黑场渐变。")}</li>
      <li>{t("MAIN Scene: background & grass → clouds → campus → cat & lantern → stencil write → layered blackout (5 layers) → confetti → (if celebrating) fireworks particles → title overlays.", "校园：背景和草地 → 云 → 建筑 → 小猫和灯笼 → 写入模板 → 五层遮黑 → 彩纸 → 庆典烟花粒子 → 标题。")}</li>
    </ul>
    <h2 id="cover" data-thread-chapter>{t("3. Scene 1: Cover Design Details", "3. 场景一 · 封面")}</h2>
    <p>{t("The following figure provides the cover layout.", "下图展示了封面各元素的位置。")}</p>
    <ReportFigure folder="card" files={["Im2.png"]} caption={t("Figure 3 Cover scene layout placeholder.", "图 3 · 封面布局。")} />
    <p>{t("As shown in the figure 3, the cover background is implemented using a simple but festive visual effect — a soft yellow background combined with purple line-drawn stars. The overall color palette enhances the cheerful atmosphere of the celebration.", "封面以柔黄色衬底，用紫色线条勾勒星星，形成轻快的校庆气氛。")}</p>
    <h3>{t("Elements", "画面元素")}</h3>
    <ul>
      <li>{t("The triangular flags, balloons, and cat on the cover reuse the same drawing functions as those in the main scene.", "三角旗、气球和小猫与主场景共用一套绘制函数。")}</li>
      <li>{t("Each star is designed in a minimal but elegant way: it consists of four groups of main lines — one vertical line (longest), one horizontal line (medium), and two diagonal lines (slightly shorter).", "每颗星由四组线组成：竖线最长，横线居中，两条对角线稍短。")}</li>
      <li>{t("Using the dashRays() function, a set of dotted radial rays are drawn around each star to create a glowing effect. The stars are animated to change their size over time, creating a twinkling effect.", "dashRays() 在星星四周绘制放射状虚线。星星的尺寸随时间微微起伏，形成闪烁感。")}</li>
    </ul>
    <h3>{t("Title Text", "标题")}</h3>
    <p>{t("At the bottom of the cover, the main title uses simple scaling to create a perspective effect—objects appear larger when closer. Each character (“2”, “0”, “T”, “H”, heart) is drawn as a pixel grid defined by strings of ’0’ and ’1’. To keep the pixel style while adding depth, lower pixel rows are scaled slightly wider than upper ones, forming an isosceles trapezoid that gives the title a sense of 3D feeling.", "底部的“2”“0”“T”“H”和心形都以 0、1 字符串构成像素网格。靠近底部的行略宽于顶部，形成等腰梯形，使标题有向观者展开的透视感。")}</p>
    <h3>{t("Cat Character", "小猫")}</h3>
    <p>{t("The function drawHero() draws a small cat whose head and body slowly grow and shrink to look like breathing. Its tail also moves left and right in a gentle swing. These movements are made using sine functions.", "drawHero() 用正弦函数微调头和身体的大小，让小猫像在呼吸，尾巴也会轻轻左右摆动。")}</p>
    <ul>
      <li>{t("breath controls the subtle scaling of the head and body.", "breath 控制头部和身体的细微缩放。")}</li>
      <li>{t("tailSwing controls the small oscillation of the tail’s angle.", "tailSwing 控制尾巴摆动的角度。")}</li>
    </ul>
    <p>{t("To further illustrate the cat’s animation and pose, the following pair of picture will display tow pose of cat.", "两张画面分别展示呼吸和摆尾的姿势。")}</p>
    <ReportFigure folder="card" files={["Im3.png","Im4.png"]} caption={t("Figure 4 Two frames for cat animation (placeholders).", "图 4 · 小猫动画的两个姿势。")} labels={[t("(a) Breathing frame.", "（a）呼吸。"),t("(b) Tail-swing frame.", "（b）摆尾。")]} />
    <h3>{t("Mouse Interaction", "鼠标交互")}</h3>
    <p>{t("A fish-shaped cursor follows the mouse to make the cover more fun. When the fish gets close to the cat, the cat stops walking and looks at it. If the player moves the cursor away without clicking the left mouse button to “feed” the fish, the cat starts walking again, showing a simple chasing behavior.", "鱼形光标跟随鼠标。靠近小猫时，它会停下看鱼；玩家不喂鱼就移开光标，小猫会继续走动，形成简单的追逐互动。")}</p>
    <h2 id="campus" data-thread-chapter>{t("4. Scene 2: Campus and Soft Flashlight System", "4. 场景二 · 校园与软边手电")}</h2>
    <p>{t("Before diving into the sky and object construction, the following figure sketches the main scene, and scene 2 is only a part of the campus area. The full view (Scene 3) appears gradually as the camera or viewport moves.", "图 5 展示校园主场景。第二阶段只看见校园的一部分，随后镜头移动，第三阶段才逐渐展开全景。")}</p>
    <ReportFigure folder="card" files={["Im5.png"]} caption={t("Figure 5 Main scene composition(without black screen.", "图 5 · 主场景构图，已移除黑色遮罩。")} />
    <h3>{t("Sky", "天空")}</h3>
    <p>{t("Using the fixed-function OpenGL pipeline (without shaders or textures), the project creates a multi-section gradient sky that shows smooth color changes—from deep night blue to sky blue, golden yellow, warm orange, and red. The sky is drawn with a striped gradient: the visible height is divided into 80–160 thin horizontal strips, and each strip’s top and bottom colors come from a gradient function. This produces a soft layered look.", "天空用固定功能 OpenGL 管线绘制，无需着色器或贴图。色带从深蓝过渡到天蓝、金黄、暖橙和红色；各横条按高度插值颜色。")}</p>
    <p>{t("Although the gradient could be made smoother, I kept a slight “pixel-striped” effect to fit the project’s overall pixel style.", "我保留了轻微的条带边界，让天空与整张贺卡的像素风格一致。")}</p>
    <p>{t("Small bright dots are added in the upper half of the screen, and their transparency changes gently over time to look like faint twinkling stars, helping the scene transition naturally into the darker stage.", "屏幕上半部散布微小亮点，透明度随时间起伏，像隐约闪烁的星光，也让画面自然过渡到暗处。")}</p>
    <h3>{t("Clouds", "云层")}</h3>
    <p>{t("The cloud system is organized hierarchically, from the base function drawCloudBlob() to the higher-level drawCloudCluster(), allowing clouds to form naturally from small blobs into larger groups.", "从 drawCloudBlob() 的单个云团到 drawCloudCluster() 的组合，逐层构建出大小不同的云。")}</p>
    <ul>
      <li>{t("Each cloud is composed of multiple semi-transparent ellipses stacked together, forming four layers: shadow, gray body, highlight, and a soft outer rim. Typically, one full cloud combines 3–4 small clusters.", "半透明椭圆叠出阴影、灰色主体、高光和柔软外缘四层。通常由三到四个小云团组成一朵云。")}</li>
      <li>{t("A flat-cut bottom greatly improves realism. This effect is achieved by drawing a rectangular “mask bar” to trim the lower edge and blend it smoothly with the sky color.", "用矩形遮罩切平云底，再把底边融入天空颜色，形态更接近真实云层。")}</li>
      <li>{t("Clouds of different sizes are arranged in several horizontal rows, creating a natural sense of depth and distance.", "不同大小的云按多排水平分布，形成远近层次。")}</li>
    </ul>
    <p>{t("The two images below show the effect of the flat-cut cloud base.", "下图对照了云底切平前后的形状。")}</p>
    <ReportFigure folder="card" files={["Im6.png","Im7.png"]} caption={t("Figure 6 Cloud without flat-cut.", "图 6 · 云底形状对照。")} labels={[t("(a) Cloud with flat-cut.", "（a）切平底边的云。"),t("(b) Flat-cut base.", "（b）平切的云底。")]} />
    <h3>{t("Triangular Flags", "三角旗")}</h3>
    <p>{t("The flags are drawn in screen-space coordinates, and the projection is reset each frame so they stay at the top of the screen, like a decorative border of the card.", "旗串按屏幕坐标绘制，每帧重置投影，使其固定在画面顶端，成为贺卡的边饰。")}</p>
    <p>{t("To make the motion look more natural, each flag’s tip moves up and down using a sine function based on its x-position. Small semi-transparent white dots are added as highlights.", "每面旗的尖端依横坐标作正弦起伏，再叠加半透明白点作高光。")}</p>
    <ReportFigure folder="card" files={["Im8.png"]} caption={t("Figure 7 Triangular flags placeholder.", "图 7 · 三角旗。")} />
    <h3>{t("Balloons", "气球")}</h3>
    <p>{t("Each balloon is made of a round body, a small darker triangular knot, a bright highlight, and a thin line as the string. The balloons float slowly over time, and their vertical movement changes slightly with x-position to make the motion less uniform. Three layouts are used—center, top edge (after camera moves), and sides—with lower density to keep buildings and text clear.", "气球由圆形主体、较深的三角绳结、高光和细绳组成。不同横坐标使用略有差别的上下浮动。中央、镜头移动后的顶边及两侧各有一套布局，密度控制在不遮住建筑和文字的程度。")}</p>
    <h3>{t("Buildings", "校园建筑")}</h3>
    <p>{t("The figure below shows the construction of the building section, which mainly includes the shadow, four main building parts, and the stone monument.", "下图拆解建筑群的投影、四组主要楼体和校名石碑。")}</p>
    <ReportFigure folder="card" files={["Im9.png"]} caption={t("Figure 8 Buildings.", "图 8 · 校园建筑。")} />
    <ul>
      <li>{t("Shadows: Reusable adjustable quadrilateral shadows are used under major structures; transparency and vertical stretch are parameterized.", "投影：主要建筑下都使用可复用的四边形阴影，透明度与纵向延伸可以独立调节。")}</li>
      <li><strong>{t("Foundation Building", "基础楼")}</strong><br />{t("Built from grouped rectangles divided into left, center, and right blocks, with small side wings referring to real photos. A layer of glass strips is added on top.", "以左、中、右三组矩形构造主体，参照实景照片添加两侧小翼，再叠上一层玻璃条带。")}</li>
      <li><strong>{t("Library", "图书馆")}</strong><br />{t("The library includes upper-left, upper-right, and lower parts. It mainly uses square shapes with semi-transparent gray rectangles to show glass. The base has several stacked gray rectangles in dark and light tones to create depth and steps.", "楼体分为左上、右上和下方三部分，以方形和半透明灰色矩形表现玻璃。底部错落叠放深浅灰矩形，形成台阶和纵深。")}</li>
      <li><strong>{t("S-Building", "S 楼")}</strong><br />{t("This building uses reddish-brown blocks with grid lines showing the wall panels. The drawing order is: base color → grid lines → decoration → outer contour. Glass corridors connect the segments, and a main function combines several units into one continuous complex.", "红褐色块和网格线构成墙面。先铺底色，再画网格、装饰与外轮廓。玻璃连廊接起各段，主函数把单元组合成连续楼群。")}</li>
      <li><strong>{t("Gymnasium", "体育馆")}</strong><br />{t("Similar to the S-building, the gym is made of two joined parts. Each part (drawGymUnitSimple()) uses a large rectangle with a horizontal color change to show the glass lower section and tinted upper body. Zigzag lines are used as simple wall decorations. The function drawGymnasiumSimple() scales and combines the two parts to form the whole gym.", "体育馆同样由两段连接而成。drawGymUnitSimple() 用横向色差区分玻璃下层与有色上层，折线装饰墙面；drawGymnasiumSimple() 缩放并组合两段。")}</li>
      <li><strong>{t("Stone Monument and Nameplate", "校名石碑与标牌")}</strong><br />{t("A reusable stone monument system allows color and text changes. The main XJTLU monument (based on the Foundation Building plaza) is larger and more detailed, with blue outline text spelling the university name. On its left, a simplified shield emblem is drawn with vertical, horizontal, and diagonal lines, then outlined again with thicker strokes (the same method is used for the celebration title in Scene 3). Three small dots inside the shield mark the emblem details. Above the monument, small flags in XJTLU colors are displayed, and smaller blue plaques inspired by campus signs are placed in front of the buildings.", "石碑组件可更换颜色和文字。主碑参考基础楼广场，体量更大，用蓝色描边写出校名。左侧盾徽由竖、横、斜线组成，再加粗描边，内部以三点标示细节。碑上使用校色旗帜，楼前的小蓝牌则参考校园导视。")}</li>
    </ul>
    <h3>{t("Grass and Trees", "草地与树木")}</h3>
    <ul>
      <li><strong>{t("Grass System", "草地")}</strong><br />{t("A solid green base layer is drawn first, followed by dense triangular grass patches. Each patch uses three color tones—dark, mid, and bright—to represent shadow, midtone, and highlight.", "先铺实心绿底，再以密集三角草叶叠出深、中、浅三个色阶，分别表现阴影、中间调和高光。")}</li>
      <li>{t("Tufts: 1–4 thin triangles form small grass clusters, placed with a high probability in each area.", "草束：每丛由一至四个窄三角形组成，在各区域按较高概率铺开。")}</li>
      <li>{t("Clumps: Semi-transparent ellipses under the tufts create soft shadows and make the grass appear fuller. Using separate ellipses keeps the scene clean and avoids messy overlapping shadows.", "草丛阴影：在草束下布置独立的半透明椭圆，增加厚度并避免阴影反复叠黑。")}</li>
      <li><strong>{t("Trees", "树木")}</strong><br />{t("Trees use block shapes to match the pixel style. The canopy is made of stacked color blocks from light to dark for shading, and the trunk is a simple vertical rectangle.", "树冠使用从亮到暗的叠层色块，树干用竖直矩形，让植被延续整体像素风格。")}</li>
    </ul>
    <ReportFigure folder="card" files={["Im10.png"]} caption={t("Figure 9 Tuft and Clumps.", "图 9 · 草束与草丛。")} />
    <h3>{t("Dark Mask and Flashlight Effect", "暗部遮罩与手电光")}</h3>
    <p>{t("After all background elements are drawn, a semi-transparent black layer covers the whole scene.", "绘制完所有背景后，叠加半透明的全屏黑色层。")}</p>
    <p>{t("The stencil buffer is divided into circular zones centered on the flashlight: the outermost area is 0, the rings are 1–4, and the bright center is 5. During rendering, the program draws full-screen black rectangles for each zone, setting different alpha values: darkest outside, lighter toward the center, and none in the middle. This forms a smooth light gradient with soft edges and a bright focus at the center.", "模板缓冲以手电中心划分圆形区域：外侧为 0，四个环带为 1–4，亮心为 5。各区叠加不同透明度的黑色矩形，外侧最暗，越靠近中心越亮，中心不遮黑，由此得到软边光斑。")}</p>
    <ReportFigure folder="card" files={["Im11.png"]} caption={t("Figure 10 Five-ring stencil flashlight (placeholder).", "图 10 · 五圈模板手电。")} />
    <h2 id="fireworks" data-thread-chapter>{t("5. Scene 3: Fireworks and Celebration", "5. 场景三 · 烟花庆典")}</h2>
    <p>{t("The following picture stands for the overall celebration scene.", "下图为完整的庆典场景。")}</p>
    <ReportFigure folder="card" files={["Im12.png"]} caption={t("Figure 11 Celebration scene.", "图 11 · 庆典场景。")} />
    <h3>{t("Fireworks System", "烟花系统")}</h3>
    <ul>
      <li>{t("Each firework has three stages: launch, burst, and fade, all controlled by a particle system to create dynamic effects.", "烟花分为发射、绽放和消散三个阶段，均由粒子系统控制。")}</li>
      <li>{t("launchRocket() creates and moves rockets upward to random heights defined by spawnFireworkBurst(), ensuring explosions occur in the upper half of the screen.", "launchRocket() 将火箭送到 spawnFireworkBurst() 选出的随机高度，让烟花在画面上半部绽放。")}</li>
      <li>{t("While rising, emitTrail(const Rocket& rk) generates short-lived trail particles with bright colors from the FW_COLS palette, forming flickering light dots along the rocket’s path.", "上升时，emitTrail(const Rocket& rk) 从 FW_COLS 色板取亮色生成短寿命尾迹粒子，沿飞行路径留下一串闪光。")}</li>
      <li>{t("At the target height, emitBurst(cx, cy, n) produces an explosion by spreading 𝑛 particles evenly in a circle, each with random velocity, lifetime, and color, with white particles at the center for stronger flashes.", "到达目标高度时，emitBurst(cx, cy, n) 将 n 个粒子沿圆周均匀散开，为各粒子随机分配速度、寿命与颜色，中心再用白粒子增强闪光。")}</li>
      <li>{t("All particles are stored in the global list gParticles and updated each frame by updateParticles(float dt). Particles fade out gradually as their lifetime reaches zero.", "所有粒子存放在全局列表 gParticles 中，每帧由 updateParticles(float dt) 更新；寿命耗尽时逐渐淡出。")}</li>
    </ul>
    <h2 id="text" data-thread-chapter>{t("6. Text and Hint System", "6. 文字与提示")}</h2>
    <p>{t("The text display system has two layers:", "文字系统分为两层。")}</p>
    <ul>
      <li>{t("A hint layer for user prompts.", "提示层给出玩家操作说明。")}</li>
      <li>{t("A celebration title layer for festive text.", "庆典标题层显示节日文字。")}</li>
    </ul>
    <ReportFigure folder="card" files={["Im13.jpg"]} caption={t("Figure 12 Text system.", "图 12 · 文字系统。")} />
    <h3>{t("Interactive Hint Texts", "交互提示")}</h3>
    <ul>
      <li>{t("bitmapTextWidth() calculates the pixel width of a string so that drawHintTopCenter() can center it on the screen. The function also supports vertical offset for positioning. Together, they draw normal on-screen hints.", "bitmapTextWidth() 计算文字像素宽度，供 drawHintTopCenter() 居中排版；还可用纵向偏移调整位置。")}</li>
      <li>{t("drawThankBubbleAboveHero() displays a floating speech bubble above the main character (e.g., showing “Thank you.”). The bubble moves slightly up and down using sin(gTime) to create a lively animation.", "drawThankBubbleAboveHero() 在角色上方显示“Thank you”等对话气泡，用 sin(gTime) 让气泡轻轻浮动。")}</li>
    </ul>
    <h3>{t("Celebration Title Texts", "庆典标题")}</h3>
    <ul>
      <li>{t("drawStrokeOutlinedLineCentered_simple() draws celebration slogans with two layers—an outline and inner text—for a clean, bold look. Then drawCelebrationBanner() combines two such lines into a complete banner.", "drawStrokeOutlinedLineCentered_simple() 分别画轮廓和内层文字；drawCelebrationBanner() 将两行标语组合成清楚醒目的横幅。")}</li>
    </ul>
    <h2 id="limits" data-thread-chapter>{t("7. Limitations and Improvements", "7. 局限与改进")}</h2>
    <ul>
      <li><strong>{t("Inconsistent naming and redundant functions", "命名不统一、函数重复")}</strong><br />{t("Some parts of the code contain repeated logic or unclear naming. For example, the main character was initially a human, so many related functions use the prefix hero. After changing the character to a cat, the old naming remained, causing confusion and reducing readability.", "角色原型最初是人，因此许多函数沿用 hero 前缀。改成小猫后仍保留旧名，加上部分重复逻辑，降低了可读性。")}</li>
      <li><strong>{t("Code structure too heavy", "代码结构偏重")}</strong><br />{t("The overall code can be simplified. Several initialization or setup functions duplicate similar tasks and could be merged or refactored to improve clarity and maintainability.", "多个初始化或配置函数承担相似任务，可整合以提升清晰度和可维护性。")}</li>
      <li><strong>{t("Lack of window-size adaptability", "窗口尺寸适配不足")}</strong><br />{t("Some rendering methods do not adjust properly to window resizing. When the viewport is reduced, certain buildings or objects may overlap or move out of frame. Future improvements should include adaptive scaling or coordinate normalization to maintain visual consistency across different resolutions.", "缩小视口时，部分建筑会重叠或移出画框。后续可采用自适应缩放或统一坐标，让不同分辨率下的构图更加稳定。")}</li>
    </ul>
  </>
}
