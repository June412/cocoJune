import ReportFigure from './ReportFigure'

export default function CyberTravelReport() {
  return <>
    <h2>I. INTRODUCTION</h2>
    <p>The project aims to build a small interactive world with a futuristic atmosphere using a narrative structure. The user enters the application through a simple “Play” interface, which introduces the backstory and leads into the Room scene. The room functions as the entry point to the cyber world and therefore remains intentionally minimal, using holographic elements and texture-mapped props to create a technological mood.</p>
    <p>Following the on-screen instruction, the user presses the space bar to activate the transition sequence. Two texture-based transitions are used: an screen displayed on the computer, followed by a rotating vortex texture that transports the user into the cyber world.</p>
    <p>The cyber city serves as the main scene, continuing the cat model I designed in the 2D assignment, and the cat is fixed at the lower part of the viewport. By shifting the world itself, I let the city streets continuously appear and disappear as the character moves forward. This design is inspired by the looped structure from Lab8’s train system. To present richer world layers, I built multiple subsystems in the cyber city, including a weather system, traffic system, building system, and holographic advertisement system. I also focused on the overall color tone, so different skyboxes and palettes are used for daytime, dusk, and night.</p>
    <h2 id="controls">II. README</h2>
    <h3>A. Intro</h3>
    <p>This section introduces the world setting. The user selects a button to enter the world, and the program first enters the Room scene, as shown in Fig. 1.</p>
    <ReportFigure folder="travel" files={["Im2.jpg"]} caption="Fig. 1. Overall interaction flow between the Intro, Room and Cyber City scenes." />
    <h3>B. Scene 1 — Room Scene Controls</h3>
    <p>The input actions for the Room scene are listed in Table I.</p>
    <div className="report-table"><table>
      <caption>TABLE I · CONTROLS IN ROOM SCENE</caption>
      <thead><tr><th scope="col">Action</th><th scope="col">Function</th></tr></thead>
      <tbody>
        <tr><td>Mouse Move</td><td>Look around the room (left–right, up–down)</td></tr>
        <tr><td>SPACE</td><td>Trigger the storyline: screen switches → vortex texture → enter the Cyber world</td></tr>
      </tbody>
    </table></div>
    <h3>C. Scene 2 — Cyber City Controls</h3>
    <p>This is the main scene. During the first 2.5 seconds, a welcome message is shown automatically, followed by the control HUD, as summarized in Fig. 1. Moreover, the full control set for Cyber City is provided in Table II, outlining all available movement, camera, and mode-switch actions.</p>
    <div className="report-table"><table>
      <caption>TABLE II · CONTROLS IN CYBER CITY SCENE</caption>
      <thead><tr><th scope="col">Key / Mouse</th><th scope="col">Description</th></tr></thead>
      <tbody>
        <tr><td>Mouse Move</td><td>Rotate view (Look Around)</td></tr>
        <tr><td>Z / X</td><td>Camera zoom in / out</td></tr>
        <tr><td>W / S</td><td>Move forward / backward (World Scrolling Movement)</td></tr>
        <tr><td>1</td><td>Switch to Day Mode</td></tr>
        <tr><td>2</td><td>Switch to Sunset Mode</td></tr>
        <tr><td>3</td><td>Switch to Night Mode</td></tr>
        <tr><td>R</td><td>Toggle rain system (Rain / Digital Rain at Night)</td></tr>
        <tr><td>T</td><td>Toggle glass-floor mode (view underground trains)</td></tr>
        <tr><td>SPACE</td><td>Toggle Cloud Ride mode</td></tr>
        <tr><td>H</td><td>Toggle UFO Hyper Warp mode (high-speed flight)</td></tr>
        <tr><td>C</td><td>Show / hide HUD interface</td></tr>
        <tr><td>ESC</td><td>Exit the program</td></tr>
      </tbody>
    </table></div>
    <h2 id="architecture">III. DESIGN</h2>
    <h3>A. Overall Architecture</h3>
    <p>The entire program uses a Finite State Machine (FSM) for scene management, covering four main parts: two main worlds (Room and Cyber City) and two transitions . The following sections will explain the design ideas scene by scene, from skyboxes, camera, and lighting to concrete objects and interaction mechanisms.</p>
    <h3>B. Scene 1: Intro UI (Transition Interface 1)</h3>
    <p>This interface is used to introduce the world setting, and it is a transition scene that is completely 2D-based. I use flat rectangles to draw the dialogue box and the buttons, without enabling lighting and without any 3D modeling. The purpose of this scene is simply to introduce the world background, as illustrated in Fig. 2.</p>
    <ReportFigure folder="travel" files={["Im3.jpg"]} caption="Fig. 2. Intro UI layout and transition screen combining the initial dialogue interface and the vortex transition." />
    <h3>C. Scene 2: Reality Room (Main Interdace 1)</h3>
    <p><strong>1) Overall Design and Camera Control:</strong> The Room scene is the “reality space” before entering the cyber world.</p>
    <p>In STATE_ROOM, the camera is fixed slightly above the desk, and yaw/pitch are updated from mouse input to create a first-person look-around experience, as shown in Fig. 3.</p>
    <ReportFigure compact folder="travel" files={["Im4.png"]} caption="Fig. 3. Overall layout of the Room scene, including desk, screens, and server towers." />
    <p>A cool-colored directional light is placed at the upper-right side to simulate night light from outside the window. Its diffuse and ambient components use a blue tone.</p>
    <p><strong>2) Structure of the Room Scene:</strong> The Room scene consists of three main modules, shown in Table III.</p>
    <div className="report-table"><table>
      <caption>TABLE III · MAIN MODULES OF THE ROOM SCENE</caption>
      <thead><tr><th scope="col">Module</th><th scope="col">Description</th></tr></thead>
      <tbody>
        <tr><td>A. Room Shell (drawRoom())</td><td>Floor, walls, ceiling, sci-fi ceiling grid, server towers, tech panels, framed artworks</td></tr>
        <tr><td>B. Desk and PC (drawDeskAndPC())</td><td>Desk, monitors, keyboard, mouse, transparent PC case, VR headset, plant, cup</td></tr>
        <tr><td>C. Indoor Particle (drawRoomDust())</td><td>700 floating pink dust particles</td></tr>
      </tbody>
    </table></div>
    <h4>A. Room Shell and Static Environment (drawRoom()):</h4>
    <p>The room uses a dark floor, three walls, and a ceiling (about 5 × 5 × 5). Textures include:</p>
    <ul>
      <li>a dark marble floor texture (tex.floor)</li>
      <li>wall textures(tex.wall and tex.boxSide) for the front and side walls</li>
    </ul>
    <p>Two server towers and a holographic wall panel are added, and drawSciFiCeiling() draws a cyan grid on the ceiling. drawBox() provides the frame outline, and tex.frameLeft is placed as the artwork.</p>
    <p><strong>B. Desk and Interaction Core Area (drawDeskAndPC()):</strong> A dark-gray table holds</p>
    <ul>
      <li>monitors (tex.screen, tex.screen2),</li>
      <li>keyboard (tex.keyboard),</li>
      <li>mouse (drawMouseOnDesk()),</li>
      <li>VR headset (drawVRHeadset())</li>
      <li>Succulent plant (drawSucculent())</li>
      <li>Cup (drawCup())</li>
    </ul>
    <p>The most recognizable element is the transparent PC case:I draws two internal fans (wire torus + small cubes),and its exterior is drawn with blending and disabled depth writing to remain semi-transparent. A small platform and a mini drawDrone() are placed on top.</p>
    <p><strong>C. Indoor Dust Particles (drawRoomDust()):</strong> The function generates 700 particles with random positions. A time-based sinf offset produces slow vertical floating motion.</p>
    <p><strong>3) Interaction in the Room Scene:</strong> After entering STATE_ROOM, a transparent HUD shows:</p>
    <ul>
      <li>[Mouse] Look Around</li>
      <li>[SPACE] Enter Cyber World</li>
    </ul>
    <p>Pressing SPACE switches to STATE_SCREEN_FLASH, and the computer screen changes texture in preparation for the next transition, as illustrated in Fig. 4.</p>
    <ReportFigure folder="travel" files={["Im5.jpg"]} caption="Fig. 4. Transition sequence inside the Room scene, from HUD hints to screen change and vortex entry." />
    <h3>D. Scene 3: Vortex Rotation Texture Transition (Transition Interface 2)</h3>
    <p>This scene provides the transition from the Room to the Cyber City. A square vortex texture is rotated around its center by translating it to the middle of the screen, applying a rotation θ, and translating it back. GL_BLEND is enabled to create fade-in and fade-out effects. The combined effect of the screen flash and vortex is also visible in Fig. 2.</p>
    <h3 id="city">E. Cyberpunk City (Main Interface 2)</h3>
    <p>The Cyber scene is the most complex part of the project. Its design includes the view system, world structure, city elements, traffic, weather and particles, the main character, mounts, shadows, and interaction, as illustrated in Fig. 5. Then I well show these system one by one.</p>
    <ReportFigure folder="travel" files={["Im6.jpg"]} caption="Fig. 5. Overview of the Cyberpunk City main world in the different time." />
    <h4>1) View and World Structure:</h4>
    <p><strong>(1) Third-Person Follow Camera:</strong> A third-person camera follows the cat:</p>
    <ul>
      <li>camDist controls camera distance,</li>
      <li>cyberCamYaw/cyberCamPitch control rotation,</li>
      <li>Z/X adjust camera zoom.</li>
    </ul>
    <p><strong>(2) Looped City World:</strong> The world uses worldOffsetZ and LOOP_LEN:</p>
    <ul>
      <li>City segments repeat along the z-axis,</li>
      <li>Each segment contains roads, tracks, buildings, and billboards,</li>
      <li>Segments outside the visible range are culled.</li>
    </ul>
    <h4>(3) Time-Based Lighting and Atmosphere:</h4>
    <p>setupCyberLighting() adjusts lighting, fog, and clear color based on currentTimeOfDay. Table IV summarizes the three modes.</p>
    <div className="report-table"><table>
      <caption>TABLE IV · LIGHTING AND ATMOSPHERE SETTINGS</caption>
      <thead><tr><th scope="col">Mode</th><th scope="col">Lighting &amp; Fog</th><th scope="col">Skybox / Texture</th></tr></thead>
      <tbody>
        <tr><td>TIME_DAY</td><td>GL_LIGHT1 sunlight, light fog</td><td>Blue palette, tex.bgDay</td></tr>
        <tr><td>TIME_SUNSET</td><td>Low-angle LIGHT1, orange diffuse; LIGHT2 lamps</td><td>Warm palette, tex.bgSunset</td></tr>
        <tr><td>TIME_NIGHT</td><td>Moonlight LIGHT1; moving LIGHT2; extra LIGHT3; purple fog</td><td>Neon palette, tex.bgNight</td></tr>
      </tbody>
    </table></div>
    <p><strong>2) City Segmentation System:</strong> The city is generated by repeating segments along the z-axis.</p>
    <h4>(1) Road and Platforms:</h4>
    <ul>
      <li>tex.road for the main road with rainbow decorations,</li>
      <li>tex.cyberPavement for platforms and bases,</li>
      <li>isTransparentFloor enables a cyan glass-floor effect.</li>
    </ul>
    <p><strong>(2) Multi-Layer Neon Buildings:</strong> Buildings are stacked rectangular bodies with variations. Floors may include:</p>
    <ul>
      <li>billboard screens,</li>
      <li>rotating top structures and glowing rings,</li>
      <li>colored windows and line decorations,</li>
      <li>a bright ground-floor entrance.</li>
    </ul>
    <p><strong>(3) Holographic Advertisement System:</strong> Four types of ads are used (Table V). A combined example of building-side ads and nearby vegetation is shown in Fig. 6. Ads are drawn with drawCyberScreen() or drawHologram(), using translation, rotation, scrolling lines, or rotating 3D shapes.</p>
    <div className="report-table"><table>
      <caption>TABLE V · HOLOGRAPHIC ADVERTISEMENT TYPES</caption>
      <thead><tr><th scope="col">Type</th><th scope="col">Position / Form</th></tr></thead>
      <tbody>
        <tr><td>Wall Screen Ads</td><td>Mounted on building walls</td></tr>
        <tr><td>Cross-Street Banner</td><td>Banner spanning the street</td></tr>
        <tr><td>Rooftop Ads</td><td>Billboard on rooftops</td></tr>
        <tr><td>Street Level Ads</td><td>Holograms at ground level</td></tr>
      </tbody>
    </table></div>
    <ReportFigure compact folder="travel" files={["Im7.jpg"]} caption="Fig. 6. Example of cyber trees and nearby holographic advertisements in a city segment." />
    <p><strong>(4) Street Lamp System:</strong> Lamps placed at lampX positions are built with drawRichLamp(), with a glowing cone representing the light area, as illustrated in Fig. 7.</p>
    <ReportFigure compact folder="travel" files={["Im8.jpg"]} caption="Fig. 7. Street lamp design with extended arm geometry and glowing cone light region." />
    <p><strong>(5) Cyber Vegetation:</strong> At each greenX position, the scene places a cyber tree (drawCyberTree) or bushes (drawCyberBush). The trunk is a cone, the crown is a rotatable polyhedron, and small spheres act as berries. An example layout with both trees and ads is shown in Fig. 6.</p>
    <p><strong>(6) Mega Pipes:</strong> In the upper layer of the Cyber City, a series of large pipes span across the streets. The design is inspired by Chongqing’s trains that pass directly through buildings. Each pipe consists of a cylindrical main body with connector rings, bottom-mounted tech boxes, and a few suspension cables added along its length. At night, the pipes display energy pulses: circular pulses travel rapidly along the surface and leave a short fading trail and additive blending is used, as illustrated in Fig. 8.</p>
    <ReportFigure folder="travel" files={["Im9.jpg"]} caption="Fig. 8. Mega Pipes spanning above the Cyber City, with nighttime energy pulse effects." />
    <p><strong>3) Traffic System:</strong> The Cyber traffic system includes ground, aerial, and underground layers. All motion is driven by realTime and the world offset worldOffsetZ, allowing vehicles and objects to loop continuously while distant elements are culled for performance. An overview is shown in Fig. 9.</p>
    <ReportFigure folder="travel" files={["Im10.jpg"]} caption="Fig. 9. Multi-layer transport system including ground vehicles, elevated trains, UFOs, drones, and underground Shinkansen." />
    <h4>(1) Ground and Low-Altitude Traffic:</h4>
    <p>Hover cars (drawHoverCar()) and ground cars (drawGroundCarFuture()) run in four lanes. Each lane is defined in drawTrafficSystem() by its center position (laneCenters[]), vehicle type (isHoverType), direction, base speed, and color index.</p>
    <p><strong>(2) Elevated Trains and Underground Shinkansen:</strong> Sky trains use a TrainConfig (position, height, speed, direction, offset, theme). Train cars (drawTrainCar()) use tex.skyTrain, with window and stripe colors adjusted by time of day. Each train includes slight sway and projected shadows for depth. Two Shinkansen trains run underground in opposite directions with higher speed, longer loop cycles, and a fixed low Y position.</p>
    <p><strong>(3) UFO Fleet:</strong> UFOs enhance the vertical layers of the scene. Bodies use silver (day) or dark gray (night), with semi-transparent cockpits, a glowing ring, and a thruster cone rendered with additive blending. Formations include a figure-8 unit with gentle bobbing, a large cruiser orbiting the city, high-altitude fleets staggered along the z-axis, and low-altitude patrol units aligned with traffic lanes.</p>
    <p><strong>(4) Drones and High-Tech Traffic Ships:</strong> Eight drones move based on time t, combining circular X/Y motion with looping Z displacement using worldOffsetZ and LOOP_LEN. Bodies are drawn with drawDrone().</p>
    <p>Traffic ships (drawTrafficShip()) use an ellipsoid body, a rotating neon ring, and simplified line-based wings.</p>
    <p><strong>(5) Daytime-Only Paper Plane Group:</strong> During TIME_DAY, about 15 paper planes fly along smooth cos/sin curves. They are simple triangular faces drawn without lighting, using light pastel colors to create a soft daytime effect.</p>
    <h4>4) Rain, Ripples, and Particle System:</h4>
    <p><strong>(1) Rain and “Digital Rain”:</strong> isRaining controls rain activation. initRain() assigns random position (x, y, z), fall speed, type, and a random offset. Heights are looped with fmod so raindrops recycle within a fixed range.</p>
    <p>In drawRainSystem():</p>
    <h4>Day / Sunset:</h4>
    <ul>
      <li>Rain is rendered as long thin streaks using GL_LINES.</li>
      <li>Day uses cool bluish tones; sunset uses warmer orange tones.</li>
      <li>Blending uses GL_SRC_ALPHA and GL_ONE_MINUS_SRC_ALPHA.</li>
    </ul>
    <h4>Night:</h4>
    <ul>
      <li>Raindrops split into line streaks and green “0/1” characters (glutBitmapCharacter).</li>
      <li>Character alpha oscillates over time, producing a slight flicker.</li>
    </ul>
    <p>The overall visual effect of rain and digital rain is shown in Fig. 10.</p>
    <ReportFigure folder="travel" files={["Im11.jpg"]} caption="Fig. 10. Rain and digital-rain effect rendered in the Cyber City scene." />
    <p><strong>(2) Ground Ripples:</strong> drawRipples() generates ripples with random positions offset by worldOffsetZ. Each ripple stores a lifespan and maximum radius and fades gradually.</p>
    <p>Ripples are removed when expired or outside the culling range. Lighting is disabled, and additive blending creates a soft glowing outline, especially visible at night.</p>
    <h4>5) Main Character and Mounts:</h4>
    <p><strong>(1) Cyber Cube Cat:</strong> The main character is a cube-style cat built from simple geometric primitives. A thin wireframe outline is added, and its color scheme switches with the time of day.</p>
    <p><strong>(2) Leg and Tail Animation:</strong> Leg motion is driven by globalTimeCat using sine functions. Front and back legs use a phase offset to create alternating steps. In Cloud Ride and UFO modes, the motion amplitude is reduced to maintain a stable flight pose.</p>
    <p>The tail consists of multiple spheres. Each segment applies time-based rotation with an index offset, forming a smooth curve:</p>
    <ul>
      <li>slow left–right sway during walking,</li>
      <li>increased frequency when the cat accelerates.</li>
    </ul>
    <p><strong>(3) Three Movement Modes and Mounts:</strong> The cat switches between three states, as shown in Fig. 11.</p>
    <ReportFigure compact folder="travel" files={["Im12.jpg"]} caption="Fig. 11. Cyber cube cat main character used in the Cyber City scene." />
    <h4>Walking Mode</h4>
    <p>Default mode. The cat remains on the ground and moves with the camera and worldOffsetZ.</p>
    <h4>Cloud Ride Mode</h4>
    <p>When isCloudMode is true:</p>
    <ul>
      <li>the cat rises to mid-height and gently floats,</li>
      <li>a mechanical cloud with breathing motion, neon ring, and thruster cone is drawn below,</li>
      <li>the cat is placed in a riding pose for elevated exploration.</li>
    </ul>
    <h4>Hyper Warp Mode (UFO Mount)</h4>
    <p>When isHyperWarp is true:</p>
    <ul>
      <li>the cat shrinks and moves into an enlarged UFO,</li>
      <li>the UFO’s chamber, rotation, and thruster beams are drawn first,</li>
      <li>the cat is positioned inside the cockpit and scaled accordingly.</li>
    </ul>
    <p>All three modes reuse the same cat model, modifying only height and attachment.</p>
    <h4>6) Details: Environmental Particles and Shadows:</h4>
    <h4>(1) Floating Particles (drawFloatingParticles):</h4>
    <p>Numerous particles simulate floating dust or light specks. Their z-movement uses realTime and random speeds, looping with modulo so particles persist without regeneration. Colors follow day, sunset, and night palettes, and additive blending produces a glowing effect.</p>
    <p>In isHyperWarp mode, particles switch from GL_POINTS to short GL_LINES, creating warp-speed streaks.</p>
    <p><strong>(2) Simplified Shadow System:</strong> Two non-real-time shadow types are used:</p>
    <p>drawShadowBlob() — A flattened circular fan with darker center and lighter edges. It uses glBlendFunc(GL_DST_COLOR, GL_ZERO) so the ground is darkened by multiplication.</p>
    <p>drawSquareShadow() — A rectangular shadow for buildings and trains, drawn with slight size expansion and the same multiplicative blending.</p>
    <p><strong>7) Interaction Design (HUD and Controls):</strong> A welcome prompt appears for about 2.5 seconds upon entering the Cyber world. Afterward, drawHUD() renders the control menu on the right side and updates it based on current states.</p>
    <h4>Main interactions:</h4>
    <ul>
      <li>W / S: move forward / backward along the main road (controlling city flow via worldOffsetZ)</li>
      <li>Mouse movement: control camera yaw/pitch for free viewing</li>
      <li>Z / X: zoom camera in/out</li>
      <li>1 / 2 / 3: switch time and lighting mode (DAY / SUNSET / NIGHT)</li>
      <li>SPACE: toggle Cloud Ride mode (isCloudMode = !isCloudMode)</li>
      <li>H / h: toggle Hyper Warp mode (isHyperWarp = !isHyperWarp)</li>
      <li>R / r: toggle the rain system (isRaining = !isRaining)</li>
      <li>T / t: toggle isTransparentFloor between normal road and glass-floor mode</li>
      <li>C / c: toggle HUD visibility (showCyberHUD = !showCyberHUD)</li>
      <li>ESC: call exit(0) to immediately exit the program</li>
    </ul>
    <h2 id="conclusion">IV. CONCLUSION</h2>
    <p>This project builds a compact interactive 3D world by combining narrative transitions with real-time rendering. The Room scene, vortex transition, and Cyber City are integrated through an FSM structure, enabling smooth scene switching and consistent user interaction. The looped-city system, time-of-day lighting, weather and particle effects, and layered traffic contribute to a dynamic cyberpunk environment with controlled computational cost. The cube-cat character and its mount modes provide varied viewpoints and enhance user engagement.</p>
  </>
}
