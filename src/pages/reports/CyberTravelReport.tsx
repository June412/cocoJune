import { useSite } from '../../lib/SiteContext'
import ProjectProcess, { ProjectSketch } from '../../components/ProjectProcess'
import ReportFigure from './ReportFigure'

export default function CyberTravelReport() {
  const { t } = useSite()
  return <>
    <h2 id="introduction" data-thread-chapter>{t("Overview", "项目概览")}</h2>
    <p>{t("The project aims to build a small interactive world with a futuristic atmosphere using a narrative structure. The user enters the application through a simple “Play” interface, which introduces the backstory and leads into the Room scene. The room functions as the entry point to the cyber world and therefore remains intentionally minimal, using holographic elements and texture-mapped props to create a technological mood.", "我用叙事串联起一个小型未来世界。玩家在开始界面读到背景，进入现实房间，再从房间通往赛博城市。房间布置刻意简洁，用全息元素和贴图道具建立科技氛围。")}</p>
    <p>{t("Following the on-screen instruction, the user presses the space bar to activate the transition sequence. Two texture-based transitions are used: an screen displayed on the computer, followed by a rotating vortex texture that transports the user into the cyber world.", "按照屏幕提示按空格，电脑先切换画面，随后旋转的漩涡贴图把玩家带进赛博世界。")}</p>
    <p>{t("The cyber city serves as the main scene, continuing the cat model I designed in the 2D assignment, and the cat is fixed at the lower part of the viewport. By shifting the world itself, I let the city streets continuously appear and disappear as the character moves forward. This design is inspired by the looped structure from Lab8’s train system. To present richer world layers, I built multiple subsystems in the cyber city, including a weather system, traffic system, building system, and holographic advertisement system. I also focused on the overall color tone, so different skyboxes and palettes are used for daytime, dusk, and night.", "城市是主要场景。沿用二维作业里的小猫，将它固定在视口下部，通过移动世界，让街道随着前进不断出现和消失。这种循环结构来自实验八的列车系统。天气、交通、建筑、全息广告分层组织；白天、黄昏和夜晚分别使用不同的天空盒和配色。")}</p>
    <h2 id="controls" data-thread-chapter>{t("Controls", "操作方式")}</h2>
    <h3>{t("A. Intro", "A. 开始界面")}</h3>
    <p>{t("This section introduces the world setting. The user selects a button to enter the world, and the program first enters the Room scene, as shown in Fig. 1.", "开场介绍世界设定，点击按钮后先进入房间，整体路线见图 1。")}</p>
    <ReportFigure folder="travel" files={["Im2.jpg"]} caption={t("Fig. 1. Overall interaction flow between the Intro, Room and Cyber City scenes.", "图 1 · 从开场、现实房间到赛博城市的交互流程。")} />
    <h3>{t("B. Scene 1 — Room Scene Controls", "B. 场景一 · 房间")}</h3>
    <p>{t("The input actions for the Room scene are listed in Table I.", "表 1 列出房间中的输入动作。")}</p>
    <div className="report-table"><table>
      <caption>{t("TABLE I · CONTROLS IN ROOM SCENE", "表 1 · 房间操作")}</caption>
      <thead><tr><th scope="col">{t("Action", "操作")}</th><th scope="col">{t("Function", "功能")}</th></tr></thead>
      <tbody>
        <tr><td>{t("Mouse Move", "移动鼠标")}</td><td>{t("Look around the room (left–right, up–down)", "左右、上下环顾房间")}</td></tr>
        <tr><td>{t("SPACE", "空格")}</td><td>{t("Trigger the storyline: screen switches → vortex texture → enter the Cyber world", "推进剧情：电脑换画面 → 漩涡贴图 → 进入赛博世界")}</td></tr>
      </tbody>
    </table></div>
    <h3>{t("C. Scene 2 — Cyber City Controls", "C. 场景二 · 赛博城市")}</h3>
    <p>{t("This is the main scene. During the first 2.5 seconds, a welcome message is shown automatically, followed by the control HUD, as summarized in Fig. 1. Moreover, the full control set for Cyber City is provided in Table II, outlining all available movement, camera, and mode-switch actions.", "进入主场景的前 2.5 秒显示欢迎信息，随后显示操作提示。图 1 概括流程，表 2 列出移动、镜头和模式切换。")}</p>
    <div className="report-table"><table>
      <caption>{t("TABLE II · CONTROLS IN CYBER CITY SCENE", "表 2 · 城市操作")}</caption>
      <thead><tr><th scope="col">{t("Key / Mouse", "按键／鼠标")}</th><th scope="col">{t("Description", "说明")}</th></tr></thead>
      <tbody>
        <tr><td>{t("Mouse Move", "移动鼠标")}</td><td>{t("Rotate view (Look Around)", "转动视角、环顾四周")}</td></tr>
        <tr><td>{t("Z / X", "Z / X")}</td><td>{t("Camera zoom in / out", "拉近／拉远镜头")}</td></tr>
        <tr><td>{t("W / S", "W / S")}</td><td>{t("Move forward / backward (World Scrolling Movement)", "前进／后退，以世界滚动表现移动")}</td></tr>
        <tr><td>1</td><td>{t("Switch to Day Mode", "切换至白天")}</td></tr>
        <tr><td>2</td><td>{t("Switch to Sunset Mode", "切换至日落")}</td></tr>
        <tr><td>3</td><td>{t("Switch to Night Mode", "切换至夜间")}</td></tr>
        <tr><td>{t("R", "R")}</td><td>{t("Toggle rain system (Rain / Digital Rain at Night)", "开关降雨；夜晚为数字雨")}</td></tr>
        <tr><td>{t("T", "T")}</td><td>{t("Toggle glass-floor mode (view underground trains)", "切换玻璃路面，观察地下列车")}</td></tr>
        <tr><td>{t("SPACE", "空格")}</td><td>{t("Toggle Cloud Ride mode", "开关乘云模式")}</td></tr>
        <tr><td>{t("H", "H")}</td><td>{t("Toggle UFO Hyper Warp mode (high-speed flight)", "开关 UFO 跃迁模式，高速飞行")}</td></tr>
        <tr><td>{t("C", "C")}</td><td>{t("Show / hide HUD interface", "显示／隐藏 HUD")}</td></tr>
        <tr><td>{t("ESC", "Esc")}</td><td>{t("Exit the program", "退出程序")}</td></tr>
      </tbody>
    </table></div>
    <h2 id="architecture" data-thread-chapter>{t("Scene design", "场景设计")}</h2>
    <div className="study-spread">
      <div>
        <h3>{t("A. Overall Architecture", "A. 整体架构")}</h3>
        <p>{t('A finite state machine manages the two playable worlds and the transitions into each one.', '有限状态机（FSM）管理两个可操作的场景，以及进入它们的两次过渡。')}</p>
        <ProjectProcess label={t('Scene sequence', '场景顺序')} steps={[
          { sketch: 'dialogue', title: t('Intro dialogue', '开场对话') },
          { sketch: 'room-screen', title: t('Explore the room', '探索现实房间') },
          { sketch: 'vortex', title: t('Enter the vortex', '穿过漩涡') },
          { sketch: 'city-towers', title: t('Explore Cyber City', '探索赛博城市') },
        ]} />
      </div>
      <div>
        <h3>{t("B. Scene 1: Intro UI (Transition Interface 1)", "B. 开始界面 · 第一次过渡")}</h3>
        <p>{t("This interface is used to introduce the world setting, and it is a transition scene that is completely 2D-based. I use flat rectangles to draw the dialogue box and the buttons, without enabling lighting and without any 3D modeling. The purpose of this scene is simply to introduce the world background, as illustrated in Fig. 2.", "开场是纯二维界面，以平面矩形绘制对话框和按钮，不启用灯光或三维模型，集中交代世界背景。见图 2。")}</p>
        <ReportFigure folder="travel" files={["Im3.jpg"]} caption={t("Fig. 2. Intro UI layout and transition screen combining the initial dialogue interface and the vortex transition.", "图 2 · 开场对话界面与漩涡转场。")} />
      </div>
    </div>
    <h3>{t("C. Scene 2: Reality Room (Main Interdace 1)", "C. 现实房间 · 第一个主场景")}</h3>
    <p><strong>{t("1) Overall Design and Camera Control:", "1）整体设计与镜头")}</strong> {t("The Room scene is the “reality space” before entering the cyber world.", "进入赛博世界前，玩家先停留在这个现实空间里。")}</p>
    <p>{t("In STATE_ROOM, the camera is fixed slightly above the desk, and yaw/pitch are updated from mouse input to create a first-person look-around experience, as shown in Fig. 3.", "在 STATE_ROOM 中，相机固定在书桌稍上方，鼠标输入更新偏航和俯仰，形成第一人称环视。见图 3。")}</p>
    <ReportFigure compact folder="travel" files={["Im4.png"]} caption={t("Fig. 3. Overall layout of the Room scene, including desk, screens, and server towers.", "图 3 · 房间布局，包括书桌、屏幕与服务器机柜。")} />
    <p>{t("A cool-colored directional light is placed at the upper-right side to simulate night light from outside the window. Its diffuse and ambient components use a blue tone.", "右上方的冷色方向光模拟夜光透过窗户，漫反射和环境分量都偏蓝。")}</p>
    <p><strong>{t("2) Structure of the Room Scene:", "2）房间结构")}</strong> {t("The Room scene consists of three main modules, shown in Table III.", "房间由表 3 所列的三个模块组成。")}</p>
    <div className="report-table"><table>
      <caption>{t("TABLE III · MAIN MODULES OF THE ROOM SCENE", "表 3 · 房间的主要模块")}</caption>
      <thead><tr><th scope="col">{t("Module", "模块")}</th><th scope="col">{t("Description", "说明")}</th></tr></thead>
      <tbody>
        <tr><td>{t("A. Room Shell (drawRoom())", "A. 房间外壳（drawRoom()）")}</td><td>{t("Floor, walls, ceiling, sci-fi ceiling grid, server towers, tech panels, framed artworks", "地面、墙壁、天花板与科技格栅、机柜、科技面板及带框装饰画")}</td></tr>
        <tr><td>{t("B. Desk and PC (drawDeskAndPC())", "B. 书桌与电脑（drawDeskAndPC()）")}</td><td>{t("Desk, monitors, keyboard, mouse, transparent PC case, VR headset, plant, cup", "书桌、显示器、键盘、鼠标、透明机箱、VR 头显、植物和杯子")}</td></tr>
        <tr><td>{t("C. Indoor Particle (drawRoomDust())", "C. 室内粒子（drawRoomDust()）")}</td><td>{t("700 floating pink dust particles", "700 个漂浮的粉色尘粒")}</td></tr>
      </tbody>
    </table></div>
    <h4>{t("A. Room Shell and Static Environment (drawRoom()):", "A. 房间外壳与静态布景（drawRoom()）")}</h4>
    <p>{t("The room uses a dark floor, three walls, and a ceiling (about 5 × 5 × 5). Textures include:", "房间约为 5 × 5 × 5，由深色地板、三面墙和天花板围成。使用的贴图包括：")}</p>
    <ul>
      <li>{t("a dark marble floor texture (tex.floor)", "深色大理石地板 tex.floor。")}</li>
      <li>{t("wall textures(tex.wall and tex.boxSide) for the front and side walls", "正面和侧墙分别使用 tex.wall 与 tex.boxSide。")}</li>
    </ul>
    <p>{t("Two server towers and a holographic wall panel are added, and drawSciFiCeiling() draws a cyan grid on the ceiling. drawBox() provides the frame outline, and tex.frameLeft is placed as the artwork.", "房内放置两座服务器机柜和一块全息墙板。drawSciFiCeiling() 绘制青色天花格栅；drawBox() 构造画框，框内贴上 tex.frameLeft。")}</p>
    <p><strong>{t("B. Desk and Interaction Core Area (drawDeskAndPC()):", "B. 书桌与交互中心（drawDeskAndPC()）")}</strong> {t("A dark-gray table holds", "深灰色书桌上摆放了以下物件。")}</p>
    <ul>
      <li>{t("monitors (tex.screen, tex.screen2),", "显示器（tex.screen、tex.screen2）。")}</li>
      <li>{t("keyboard (tex.keyboard),", "键盘（tex.keyboard）。")}</li>
      <li>{t("mouse (drawMouseOnDesk()),", "鼠标（drawMouseOnDesk()）。")}</li>
      <li>{t("VR headset (drawVRHeadset())", "VR 头显（drawVRHeadset()）。")}</li>
      <li>{t("Succulent plant (drawSucculent())", "多肉植物（drawSucculent()）。")}</li>
      <li>{t("Cup (drawCup())", "杯子（drawCup()）。")}</li>
    </ul>
    <p>{t("The most recognizable element is the transparent PC case:I draws two internal fans (wire torus + small cubes),and its exterior is drawn with blending and disabled depth writing to remain semi-transparent. A small platform and a mini drawDrone() are placed on top.", "透明机箱最醒目：内部两个风扇由线框圆环和小方块构成，外壳启用混合并关闭深度写入以呈现半透明效果。机箱顶端还有小平台与迷你无人机。")}</p>
    <p><strong>{t("C. Indoor Dust Particles (drawRoomDust()):", "C. 室内尘粒（drawRoomDust()）")}</strong> {t("The function generates 700 particles with random positions. A time-based sinf offset produces slow vertical floating motion.", "生成 700 个随机分布的粒子，以随时间变化的 sinf 偏移让它们缓慢上下浮动。")}</p>
    <p><strong>{t("3) Interaction in the Room Scene:", "3）房间交互")}</strong> {t("After entering STATE_ROOM, a transparent HUD shows:", "进入 STATE_ROOM 时，半透明 HUD 显示两条提示。")}</p>
    <ul>
      <li>{t("[Mouse] Look Around", "［鼠标］环顾四周")}</li>
      <li>{t("[SPACE] Enter Cyber World", "［空格］进入赛博世界")}</li>
    </ul>
    <p>{t("Pressing SPACE switches to STATE_SCREEN_FLASH, and the computer screen changes texture in preparation for the next transition, as illustrated in Fig. 4.", "按空格后切换到 STATE_SCREEN_FLASH，电脑屏幕更换纹理，为下一段转场做准备。见图 4。")}</p>
    <ReportFigure folder="travel" files={["Im5.jpg"]} caption={t("Fig. 4. Transition sequence inside the Room scene, from HUD hints to screen change and vortex entry.", "图 4 · 房间中的转场顺序，从操作提示到屏幕变化，再到进入漩涡。")} />
    <h3>{t("D. Scene 3: Vortex Rotation Texture Transition (Transition Interface 2)", "D. 旋转漩涡 · 第二次过渡")}</h3>
    <p>{t("This scene provides the transition from the Room to the Cyber City. A square vortex texture is rotated around its center by translating it to the middle of the screen, applying a rotation θ, and translating it back. GL_BLEND is enabled to create fade-in and fade-out effects. The combined effect of the screen flash and vortex is also visible in Fig. 2.", "方形漩涡贴图连接房间与城市。先将中心移到屏幕中央，旋转 θ，再移回原位。通过 GL_BLEND 实现淡入淡出，屏幕闪动与漩涡的组合效果见图 2。")}</p>
    <h3 id="city">{t("E. Cyberpunk City (Main Interface 2)", "E. 赛博城市 · 第二个主场景")}</h3>
    <p>{t("The Cyber scene is the most complex part of the project. Its design includes the view system, world structure, city elements, traffic, weather and particles, the main character, mounts, shadows, and interaction, as illustrated in Fig. 5. Then I well show these system one by one.", "城市包含视角、循环街区、建筑、交通、天气和粒子，还包括主角、坐骑、阴影与交互。图 5 展示全貌，下面逐层拆解。")}</p>
    <ReportFigure folder="travel" files={["Im6.jpg"]} caption={t("Fig. 5. Overview of the Cyberpunk City main world in the different time.", "图 5 · 不同时段的赛博城市。")} />
    <h4>{t("1) View and World Structure:", "1）视角与世界结构")}</h4>
    <p><strong>{t("(1) Third-Person Follow Camera:", "（1）第三人称跟随镜头")}</strong> {t("A third-person camera follows the cat:", "第三人称镜头跟随小猫。")}</p>
    <ul>
      <li>{t("camDist controls camera distance,", "camDist 控制镜头距离。")}</li>
      <li>{t("cyberCamYaw/cyberCamPitch control rotation,", "cyberCamYaw 与 cyberCamPitch 控制旋转。")}</li>
      <li>{t("Z/X adjust camera zoom.", "Z / X 调整远近。")}</li>
    </ul>
    <p><strong>{t("(2) Looped City World:", "（2）循环城市")}</strong> {t("The world uses worldOffsetZ and LOOP_LEN:", "通过 worldOffsetZ 和 LOOP_LEN 实现滚动。")}</p>
    <ul>
      <li>{t("City segments repeat along the z-axis,", "街区沿 z 轴循环。")}</li>
      <li>{t("Each segment contains roads, tracks, buildings, and billboards,", "每段包括道路、轨道、建筑和广告牌。")}</li>
      <li>{t("Segments outside the visible range are culled.", "剔除视野外的区段。")}</li>
    </ul>
    <h4>{t("(3) Time-Based Lighting and Atmosphere:", "（3）时段、灯光与氛围")}</h4>
    <p>{t("setupCyberLighting() adjusts lighting, fog, and clear color based on currentTimeOfDay. Table IV summarizes the three modes.", "setupCyberLighting() 根据 currentTimeOfDay 调整光照、雾和清屏色。表 4 对照三种时段。")}</p>
    <div className="report-table"><table>
      <caption>{t("TABLE IV · LIGHTING AND ATMOSPHERE SETTINGS", "表 4 · 灯光与氛围设置")}</caption>
      <thead><tr><th scope="col">{t("Mode", "模式")}</th><th scope="col">{t("Lighting & Fog", "光照与雾")}</th><th scope="col">{t("Skybox / Texture", "天空盒／贴图")}</th></tr></thead>
      <tbody>
        <tr><th scope="row"><span className="mode-sketch"><ProjectSketch name="day-sun" />TIME_DAY</span></th><td>{t("GL_LIGHT1 sunlight, light fog", "GL_LIGHT1 模拟日光，配淡雾")}</td><td>{t("Blue palette, tex.bgDay", "蓝色系，tex.bgDay")}</td></tr>
        <tr><th scope="row"><span className="mode-sketch"><ProjectSketch name="sunset" />TIME_SUNSET</span></th><td>{t("Low-angle LIGHT1, orange diffuse; LIGHT2 lamps", "低角度 LIGHT1，橙色漫反射；LIGHT2 为路灯")}</td><td>{t("Warm palette, tex.bgSunset", "暖色系，tex.bgSunset")}</td></tr>
        <tr><th scope="row"><span className="mode-sketch"><ProjectSketch name="night-moon" />TIME_NIGHT</span></th><td>{t("Moonlight LIGHT1; moving LIGHT2; extra LIGHT3; purple fog", "LIGHT1 月光、移动的 LIGHT2、补光 LIGHT3 和紫雾")}</td><td>{t("Neon palette, tex.bgNight", "霓虹色系，tex.bgNight")}</td></tr>
      </tbody>
    </table></div>
    <p><strong>{t("2) City Segmentation System:", "2）街区分段")}</strong> {t("The city is generated by repeating segments along the z-axis.", "沿 z 轴重复铺设街区，构成城市。")}</p>
    <h4>{t("(1) Road and Platforms:", "（1）道路与平台")}</h4>
    <ul>
      <li>{t("tex.road for the main road with rainbow decorations,", "主路使用 tex.road，配以彩虹色装饰。")}</li>
      <li>{t("tex.cyberPavement for platforms and bases,", "平台和底座采用 tex.cyberPavement。")}</li>
      <li>{t("isTransparentFloor enables a cyan glass-floor effect.", "isTransparentFloor 开启青色玻璃路面。")}</li>
    </ul>
    <p><strong>{t("(2) Multi-Layer Neon Buildings:", "（2）多层霓虹建筑")}</strong> {t("Buildings are stacked rectangular bodies with variations. Floors may include:", "建筑由变化的长方体堆叠而成，楼层可组合以下元素。")}</p>
    <ul>
      <li>{t("billboard screens,", "广告屏幕。")}</li>
      <li>{t("rotating top structures and glowing rings,", "旋转屋顶结构与发光圆环。")}</li>
      <li>{t("colored windows and line decorations,", "彩色窗户与线条装饰。")}</li>
      <li>{t("a bright ground-floor entrance.", "明亮的底层入口。")}</li>
    </ul>
    <p><strong>{t("(3) Holographic Advertisement System:", "（3）全息广告")}</strong> {t("Four types of ads are used (Table V). A combined example of building-side ads and nearby vegetation is shown in Fig. 6. Ads are drawn with drawCyberScreen() or drawHologram(), using translation, rotation, scrolling lines, or rotating 3D shapes.", "表 5 列出四种形式，图 6 展示楼侧广告与植被的组合。drawCyberScreen() 和 drawHologram() 通过平移、旋转、滚动线条或转动的三维形体绘制广告。")}</p>
    <div className="report-table"><table>
      <caption>{t("TABLE V · HOLOGRAPHIC ADVERTISEMENT TYPES", "表 5 · 全息广告类型")}</caption>
      <thead><tr><th scope="col">{t("Type", "类型")}</th><th scope="col">{t("Position / Form", "位置／形态")}</th></tr></thead>
      <tbody>
        <tr><td>{t("Wall Screen Ads", "墙面屏幕")}</td><td>{t("Mounted on building walls", "安装在建筑外墙")}</td></tr>
        <tr><td>{t("Cross-Street Banner", "跨街横幅")}</td><td>{t("Banner spanning the street", "横跨街道")}</td></tr>
        <tr><td>{t("Rooftop Ads", "屋顶广告")}</td><td>{t("Billboard on rooftops", "楼顶的广告牌")}</td></tr>
        <tr><td>{t("Street Level Ads", "地面广告")}</td><td>{t("Holograms at ground level", "街边的全息影像")}</td></tr>
      </tbody>
    </table></div>
    <ReportFigure compact folder="travel" files={["Im7.jpg"]} caption={t("Fig. 6. Example of cyber trees and nearby holographic advertisements in a city segment.", "图 6 · 同一街区中的赛博树和全息广告。")} />
    <p><strong>{t("(4) Street Lamp System:", "（4）路灯")}</strong> {t("Lamps placed at lampX positions are built with drawRichLamp(), with a glowing cone representing the light area, as illustrated in Fig. 7.", "在 lampX 指定位置调用 drawRichLamp()，用发光锥体表现照明范围。见图 7。")}</p>
    <ReportFigure compact folder="travel" files={["Im8.jpg"]} caption={t("Fig. 7. Street lamp design with extended arm geometry and glowing cone light region.", "图 7 · 路灯的延伸灯臂与锥形光区。")} />
    <p><strong>{t("(5) Cyber Vegetation:", "（5）赛博植被")}</strong> {t("At each greenX position, the scene places a cyber tree (drawCyberTree) or bushes (drawCyberBush). The trunk is a cone, the crown is a rotatable polyhedron, and small spheres act as berries. An example layout with both trees and ads is shown in Fig. 6.", "在 greenX 位置放置赛博树（drawCyberTree）或灌木（drawCyberBush）。树干是圆锥，树冠是可旋转的多面体，小球作浆果。与广告共处一街区的效果见图 6。")}</p>
    <p><strong>{t("(6) Mega Pipes:", "（6）高空管道")}</strong> {t("In the upper layer of the Cyber City, a series of large pipes span across the streets. The design is inspired by Chongqing’s trains that pass directly through buildings. Each pipe consists of a cylindrical main body with connector rings, bottom-mounted tech boxes, and a few suspension cables added along its length. At night, the pipes display energy pulses: circular pulses travel rapidly along the surface and leave a short fading trail and additive blending is used, as illustrated in Fig. 8.", "受重庆列车穿楼景观启发，巨型管道横跨街道上空。圆柱管身连接着环箍、底部设备箱和悬挂缆索。夜间能量环沿表面快速移动，以加法混合留下渐隐短尾。见图 8。")}</p>
    <ReportFigure folder="travel" files={["Im9.jpg"]} caption={t("Fig. 8. Mega Pipes spanning above the Cyber City, with nighttime energy pulse effects.", "图 8 · 横跨城市的巨型管道和夜间能量脉冲。")} />
    <p><strong>{t("3) Traffic System:", "3）交通系统")}</strong> {t("The Cyber traffic system includes ground, aerial, and underground layers. All motion is driven by realTime and the world offset worldOffsetZ, allowing vehicles and objects to loop continuously while distant elements are culled for performance. An overview is shown in Fig. 9.", "交通分地面、空中和地下三层。realTime 与 worldOffsetZ 驱动循环运动，剔除远处物体以控制开销。见图 9。")}</p>
    <ReportFigure folder="travel" files={["Im10.jpg"]} caption={t("Fig. 9. Multi-layer transport system including ground vehicles, elevated trains, UFOs, drones, and underground Shinkansen.", "图 9 · 地面车辆、高架列车、UFO、无人机及地下新干线构成的立体交通。")} />
    <h4>{t("(1) Ground and Low-Altitude Traffic:", "（1）地面与低空交通")}</h4>
    <p>{t("Hover cars (drawHoverCar()) and ground cars (drawGroundCarFuture()) run in four lanes. Each lane is defined in drawTrafficSystem() by its center position (laneCenters[]), vehicle type (isHoverType), direction, base speed, and color index.", "悬浮车 drawHoverCar() 与地面车 drawGroundCarFuture() 在四条车道上行驶。drawTrafficSystem() 为每条车道指定中心 laneCenters[]、车型 isHoverType、方向、基础速度和颜色索引。")}</p>
    <p><strong>{t("(2) Elevated Trains and Underground Shinkansen:", "（2）高架列车与地下新干线")}</strong> {t("Sky trains use a TrainConfig (position, height, speed, direction, offset, theme). Train cars (drawTrainCar()) use tex.skyTrain, with window and stripe colors adjusted by time of day. Each train includes slight sway and projected shadows for depth. Two Shinkansen trains run underground in opposite directions with higher speed, longer loop cycles, and a fixed low Y position.", "空中列车由 TrainConfig 设置位置、高度、速度、方向、偏移与主题。drawTrainCar() 使用 tex.skyTrain，车窗和条带颜色随时段变化，车身轻晃并投下阴影。地下两列新干线方向相反、速度更高、循环更长，固定在较低的 Y 坐标。")}</p>
    <p><strong>{t("(3) UFO Fleet:", "（3）UFO 舰队")}</strong> {t("UFOs enhance the vertical layers of the scene. Bodies use silver (day) or dark gray (night), with semi-transparent cockpits, a glowing ring, and a thruster cone rendered with additive blending. Formations include a figure-8 unit with gentle bobbing, a large cruiser orbiting the city, high-altitude fleets staggered along the z-axis, and low-altitude patrol units aligned with traffic lanes.", "白天舰身银色，夜间深灰，配半透明座舱、发光环及加法混合的推进光锥。编队包括轻轻起伏的八字航线、绕城巡航的大型舰、高空沿 z 轴错开的队列和贴着车道的低空巡逻队。")}</p>
    <p><strong>{t("(4) Drones and High-Tech Traffic Ships:", "（4）无人机与运输船")}</strong> {t("Eight drones move based on time t, combining circular X/Y motion with looping Z displacement using worldOffsetZ and LOOP_LEN. Bodies are drawn with drawDrone().", "八架无人机用 t 驱动 X/Y 平面的圆周运动，以 worldOffsetZ 和 LOOP_LEN 控制 Z 轴循环；机身由 drawDrone() 绘制。")}</p>
    <p>{t("Traffic ships (drawTrafficShip()) use an ellipsoid body, a rotating neon ring, and simplified line-based wings.", "运输船 drawTrafficShip() 由椭球船体、旋转霓虹环和线条机翼构成。")}</p>
    <p><strong>{t("(5) Daytime-Only Paper Plane Group:", "（5）日间纸飞机")}</strong> {t("During TIME_DAY, about 15 paper planes fly along smooth cos/sin curves. They are simple triangular faces drawn without lighting, using light pastel colors to create a soft daytime effect.", "TIME_DAY 时约 15 架纸飞机沿正弦、余弦曲线飞行。关闭光照，以淡彩三角面表现轻盈的纸张。")}</p>
    <h4>{t("4) Rain, Ripples, and Particle System:", "4）雨、涟漪与粒子")}</h4>
    <p><strong>{t("(1) Rain and “Digital Rain”:", "（1）雨与数字雨")}</strong> {t("isRaining controls rain activation. initRain() assigns random position (x, y, z), fall speed, type, and a random offset. Heights are looped with fmod so raindrops recycle within a fixed range.", "isRaining 控制降雨。initRain() 为雨滴指定随机位置、下落速度、类型和初始偏移；高度用 fmod 循环，使雨滴在固定范围内复用。")}</p>
    <p>{t("In drawRainSystem():", "drawRainSystem() 的绘制方式")}</p>
    <h4>{t("Day / Sunset:", "白天与日落")}</h4>
    <ul>
      <li>{t("Rain is rendered as long thin streaks using GL_LINES.", "用 GL_LINES 将雨滴拉成长细线。")}</li>
      <li>{t("Day uses cool bluish tones; sunset uses warmer orange tones.", "白天偏冷蓝，落日偏暖橙。")}</li>
      <li>{t("Blending uses GL_SRC_ALPHA and GL_ONE_MINUS_SRC_ALPHA.", "混合因子为 GL_SRC_ALPHA 和 GL_ONE_MINUS_SRC_ALPHA。")}</li>
    </ul>
    <h4>{t("Night:", "夜晚")}</h4>
    <ul>
      <li>{t("Raindrops split into line streaks and green “0/1” characters (glutBitmapCharacter).", "雨滴混合线状雨丝与绿色的“0/1”字符，字符由 glutBitmapCharacter 绘制。")}</li>
      <li>{t("Character alpha oscillates over time, producing a slight flicker.", "字符透明度随时间震荡，形成轻微闪烁。")}</li>
    </ul>
    <p>{t("The overall visual effect of rain and digital rain is shown in Fig. 10.", "图 10 展示普通雨与数字雨的对照。")}</p>
    <ReportFigure folder="travel" files={["Im11.jpg"]} caption={t("Fig. 10. Rain and digital-rain effect rendered in the Cyber City scene.", "图 10 · 城市中的降雨与夜间数字雨。")} />
    <p><strong>{t("(2) Ground Ripples:", "（2）地面涟漪")}</strong> {t("drawRipples() generates ripples with random positions offset by worldOffsetZ. Each ripple stores a lifespan and maximum radius and fades gradually.", "drawRipples() 随机选择位置并叠加 worldOffsetZ 偏移。每圈涟漪记录寿命与最大半径，随时间淡去。")}</p>
    <p>{t("Ripples are removed when expired or outside the culling range. Lighting is disabled, and additive blending creates a soft glowing outline, especially visible at night.", "涟漪到期或超出剔除范围时移除。关闭光照并采用加法混合，夜晚尤其能看清柔亮的环线。")}</p>
    <h4>{t("5) Main Character and Mounts:", "5）主角与坐骑")}</h4>
    <p><strong>{t("(1) Cyber Cube Cat:", "（1）赛博方块猫")}</strong> {t("The main character is a cube-style cat built from simple geometric primitives. A thin wireframe outline is added, and its color scheme switches with the time of day.", "主角由简单几何体组成，外沿加细线框，配色随时段切换。")}</p>
    <p><strong>{t("(2) Leg and Tail Animation:", "（2）腿和尾巴")}</strong> {t("Leg motion is driven by globalTimeCat using sine functions. Front and back legs use a phase offset to create alternating steps. In Cloud Ride and UFO modes, the motion amplitude is reduced to maintain a stable flight pose.", "globalTimeCat 驱动正弦摆腿，前后腿错开相位形成交替步态。乘云与 UFO 模式下减小摆幅，保持飞行姿势稳定。")}</p>
    <p>{t("The tail consists of multiple spheres. Each segment applies time-based rotation with an index offset, forming a smooth curve:", "尾巴由多个球体串成，每节的旋转按时间和索引错开，连成平滑曲线。")}</p>
    <ul>
      <li>{t("slow left–right sway during walking,", "行走时缓缓左右摇动。")}</li>
      <li>{t("increased frequency when the cat accelerates.", "小猫加速时提高摆动频率。")}</li>
    </ul>
    <p><strong>{t("(3) Three Movement Modes and Mounts:", "（3）三种移动与骑乘模式")}</strong> {t("The cat switches between three states, as shown in Fig. 11.", "图 11 中的小猫可在三种状态间切换。")}</p>
    <ReportFigure compact folder="travel" files={["Im12.jpg"]} caption={t("Fig. 11. Cyber cube cat main character used in the Cyber City scene.", "图 11 · 赛博城市中的方块猫主角。")} />
    <h4>{t("Walking Mode", "步行")}</h4>
    <p>{t("Default mode. The cat remains on the ground and moves with the camera and worldOffsetZ.", "默认状态。小猫在地面活动，镜头与 worldOffsetZ 配合表现前进。")}</p>
    <h4>{t("Cloud Ride Mode", "乘云")}</h4>
    <p>{t("When isCloudMode is true:", "isCloudMode 为真时：")}</p>
    <ul>
      <li>{t("the cat rises to mid-height and gently floats,", "小猫升到中等高度，轻轻悬浮。")}</li>
      <li>{t("a mechanical cloud with breathing motion, neon ring, and thruster cone is drawn below,", "下方绘制带呼吸起伏、霓虹环与推进光锥的机械云。")}</li>
      <li>{t("the cat is placed in a riding pose for elevated exploration.", "小猫摆成骑乘姿势，从高处探索城市。")}</li>
    </ul>
    <h4>{t("Hyper Warp Mode (UFO Mount)", "跃迁（UFO 坐骑）")}</h4>
    <p>{t("When isHyperWarp is true:", "isHyperWarp 为真时：")}</p>
    <ul>
      <li>{t("the cat shrinks and moves into an enlarged UFO,", "小猫缩小，进入放大的 UFO。")}</li>
      <li>{t("the UFO’s chamber, rotation, and thruster beams are drawn first,", "先画舱体、旋转结构与推进光束。")}</li>
      <li>{t("the cat is positioned inside the cockpit and scaled accordingly.", "再按比例将小猫放入驾驶舱。")}</li>
    </ul>
    <p>{t("All three modes reuse the same cat model, modifying only height and attachment.", "三种模式共用猫模型，只改变高度与附着关系。")}</p>
    <h4>{t("6) Details: Environmental Particles and Shadows:", "6）环境粒子与阴影")}</h4>
    <h4>{t("(1) Floating Particles (drawFloatingParticles):", "（1）漂浮粒子（drawFloatingParticles）")}</h4>
    <p>{t("Numerous particles simulate floating dust or light specks. Their z-movement uses realTime and random speeds, looping with modulo so particles persist without regeneration. Colors follow day, sunset, and night palettes, and additive blending produces a glowing effect.", "粒子表现尘埃和光点。Z 轴运动由 realTime 和随机速度决定，以取模循环复用。不同时间采用对应的日间、落日或夜间色板，加法混合产生发光效果。")}</p>
    <p>{t("In isHyperWarp mode, particles switch from GL_POINTS to short GL_LINES, creating warp-speed streaks.", "进入 isHyperWarp 后，粒子从 GL_POINTS 切换成短 GL_LINES，形成高速拖线。")}</p>
    <p><strong>{t("(2) Simplified Shadow System:", "（2）简化阴影")}</strong> {t("Two non-real-time shadow types are used:", "系统使用两类预设形状的阴影。")}</p>
    <p>{t("drawShadowBlob() — A flattened circular fan with darker center and lighter edges. It uses glBlendFunc(GL_DST_COLOR, GL_ZERO) so the ground is darkened by multiplication.", "drawShadowBlob()：扁平圆形三角扇，中心深、边缘浅。用 glBlendFunc(GL_DST_COLOR, GL_ZERO) 乘法压暗地面。")}</p>
    <p>{t("drawSquareShadow() — A rectangular shadow for buildings and trains, drawn with slight size expansion and the same multiplicative blending.", "drawSquareShadow()：为建筑与列车绘制略放大的矩形阴影，沿用相同的乘法混合。")}</p>
    <p><strong>{t("7) Interaction Design (HUD and Controls):", "7）HUD 与操作")}</strong> {t("A welcome prompt appears for about 2.5 seconds upon entering the Cyber world. Afterward, drawHUD() renders the control menu on the right side and updates it based on current states.", "进入赛博城市时，欢迎提示约显示 2.5 秒。随后 drawHUD() 在右侧绘制操作菜单，并按当前状态更新。")}</p>
    <h4>{t("Main interactions:", "主要操作")}</h4>
    <ul>
      <li>{t("W / S: move forward / backward along the main road (controlling city flow via worldOffsetZ)", "W / S：沿主路前进或后退，通过 worldOffsetZ 控制城市滚动。")}</li>
      <li>{t("Mouse movement: control camera yaw/pitch for free viewing", "移动鼠标：改变偏航与俯仰，自由观察。")}</li>
      <li>{t("Z / X: zoom camera in/out", "Z / X：拉近或拉远镜头。")}</li>
      <li>{t("1 / 2 / 3: switch time and lighting mode (DAY / SUNSET / NIGHT)", "1 / 2 / 3：切换白天、落日、夜间及对应灯光。")}</li>
      <li>{t("SPACE: toggle Cloud Ride mode (isCloudMode = !isCloudMode)", "空格：切换乘云模式（isCloudMode）。")}</li>
      <li>{t("H / h: toggle Hyper Warp mode (isHyperWarp = !isHyperWarp)", "H / h：切换高速跃迁（isHyperWarp）。")}</li>
      <li>{t("R / r: toggle the rain system (isRaining = !isRaining)", "R / r：开关降雨（isRaining）。")}</li>
      <li>{t("T / t: toggle isTransparentFloor between normal road and glass-floor mode", "T / t：切换普通与玻璃路面（isTransparentFloor）。")}</li>
      <li>{t("C / c: toggle HUD visibility (showCyberHUD = !showCyberHUD)", "C / c：显示或隐藏 HUD（showCyberHUD）。")}</li>
      <li>{t("ESC: call exit(0) to immediately exit the program", "Esc：调用 exit(0) 退出程序。")}</li>
    </ul>
    <h2 id="conclusion" data-thread-chapter>{t("Reflections", "项目回顾")}</h2>
    <p>{t("This project builds a compact interactive 3D world by combining narrative transitions with real-time rendering. The Room scene, vortex transition, and Cyber City are integrated through an FSM structure, enabling smooth scene switching and consistent user interaction. The looped-city system, time-of-day lighting, weather and particle effects, and layered traffic contribute to a dynamic cyberpunk environment with controlled computational cost. The cube-cat character and its mount modes provide varied viewpoints and enhance user engagement.", "项目将叙事转场与实时渲染组合成一个可探索的小型三维世界。有限状态机连接房间、漩涡和城市，维持一致的操作方式。循环街区、分时光照、天气粒子和分层交通丰富了城市，也控制了绘制开销。方块猫及两种坐骑让玩家能从地面到空中换角度观察。")}</p>
  </>
}
