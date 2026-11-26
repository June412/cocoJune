import ReportFigure from './ReportFigure'
import { GameStateDiagram, SystemOverviewDiagram } from './GreetingCardDiagrams'

export default function GreetingCardReport() {
  return <>
    <h2>Abstract</h2>
    <p>This project presents a 2D interactive greeting card celebrating the 20th Anniversary of Xi’an Jiaotong–Liverpool University (XJTLU). Built with OpenGL FreeGLUT, it combines animation, interaction, and visual design to create a playful yet elegant scene. The design focuses on smooth transitions between stages, pixel-style graphics, and layered rendering effects such as soft lighting, dynamic clouds, and fireworks. Through simple controls, users can explore the campus environment and experience a lively celebration atmosphere.</p>
    <h2>1. Introduction</h2>
    <p>This project is a 2D interactive greeting card system themed around the 20th Anniversary of Xi’an Jiaotong-Liverpool University (XJTLU). The main objective of the project is to implement a greeting card that integrates animation, interaction, and multi-scene transitions within the FreeGLUT environment.</p>
    <p>My card is designed with three main stages (or scenes): the Cover, the Campus, and the Celebration(The viewport in the third scene is larger), which are controlled by the global state variable gStage in coordination with time. The following sections first present the README of the system,which includes explanations of some code functions, interaction instructions, and key state transitions, followed by the design and transitions of the three scenes are discussed in detail. Subsequently, the hint system are described. Finally, the report concludes with a summary of the existing issues and potential improvements of the code.</p>
    <h2 id="system">2. System Overview (README)</h2>
    <p>To provide a quick visual reference of the system layout, figure 1 illustrates the overall composition used in the README.</p>
    <SystemOverviewDiagram />
    <h3>2.1. Overview</h3>
    <p>This project is a single-file interactive greeting card built with FreeGLUT + Core OpenGL. It consists of three major scenes:</p>
    <ul>
      <li>Cover Scene:The scene shows a bright starburst background, rows of flags and balloons, a cat walking back and forth, and a fish-shaped cursor.</li>
      <li>Main Scene:The scene shows a striped gradient sky, flat-topped cloud clusters, campus buildings, a soft flashlight made with five stencil layers, and a cat the player can control.</li>
      <li>Celebration Scene: displays fireworks, colorful particle dots, and a double-stroked title text.</li>
    </ul>
    <p>The transition between the Cover and Main scenes is implemented with a black fade-in/fade-out effect.</p>
    <h3>2.2. Code Map (Functions &amp; Data)</h3>
    <p>Only core interfaces are listed below, for details, refer to functions with the same names in the source code.</p>
    <ul>
      <li>Config &amp; State: window size, color palette, camera and light parameters, AppStage, GameState, input states, and time accumulators.</li>
      <li>Utils: helper functions such as currentOrthoBounds, clampf, lerp, smooth01, easeInOut, hash.</li>
      <li>Primitives: drawing rectangles, lines, circles, and ellipse fans.</li>
      <li>Reusable Widgets: flag banners, buttons, dialogue bubbles, and hint labels.</li>
      <li>Backdrop &amp; Grass: drawSkyGradientAndDots, drawGrassTufts, drawExtendedBackdrop.</li>
      <li>Clouds: drawCloudBlob, drawCloudCluster, drawCloudsClustersFlat (with stencil clipping and triple-layer transitions).</li>
      <li>Campus: stripe blocks, glass connectors, window grids, platforms, main/left/landmark/gym buildings, stone monument + flag combinations.</li>
      <li>Cat &amp; Lantern: drawHero, drawLantern.</li>
      <li>Soft Lamp: writeLampToStencil5 (writes stencil regions); drawBlackCoversSoft5 (applies layered blackout by stencil).</li>
      <li>Particles &amp; Fireworks: Rocket, Particle, tail emission emitTrail, burst emission emitBurst, periodic spawning spawnFireworkBurst, updating and drawing with updateParticles and drawParticles.</li>
      <li>Cover Scene: drawCoverBackgroundRadial, drawCoverPixelTitle_Trapezoid, drawFishCursorAtMouse, drawCoverScene; transition handled in the COVER branch of display().</li>
      <li>Update: updateHero, updateStateMachine, onIdle (controls cover cat movement, pause, and timing for scene transitions).</li>
      <li>Display: routes rendering by AppStage and overlays hints, dialogues, and titles.</li>
    </ul>
    <h3>2.3. Interaction &amp; State Machine</h3>
    <p>Figure 2 and table 1 summarize the control mapping and state progression.</p>
    <GameStateDiagram />
    <h3>Controls</h3>
    <div className="report-table"><table>
      <caption>Table 1 User Controls</caption>
      <thead><tr><th scope="col">Scene</th><th scope="col">How to Operate</th></tr></thead>
      <tbody>
        <tr><td>Cover</td><td>Left-click — Feed the fish to the cat.</td></tr>
        <tr><td>Main</td><td>Move the mouse — Shine the light to find the cat.<br />W / A / S / D — Move the character.<br />SPACE — Pull the switch.<br />Q — Exit after celebration.</td></tr>
      </tbody>
    </table></div>
    <h3>Cover Scene:</h3>
    <ul>
      <li>Left-click: feed the fish treat to the cat (activates the cover hint).</li>
    </ul>
    <h3>Main Scene:</h3>
    <ul>
      <li>Mouse movement (SEARCHING): moves the flashlight center to find the cat.</li>
      <li>W/A/S/D or Arrow keys: control the character in the GUIDING or AT_SWITCH state.</li>
      <li>SPACE: triggers the switch during AT_SWITCH, entering the celebration stage.</li>
      <li>Q: after 5 seconds in celebration, displays the “Press Q to exit ” hint.</li>
    </ul>
    <h3>Application Stages</h3>
    <p>AppStage:COVER → AppStage::MAIN (black transition lasting about 2 seconds, defined by COVER_TRANS_TOTAL).</p>
    <h3>2.4. Frame Composition</h3>
    <ul>
      <li>COVER Scene: background (starburst) → flags → pixel title “20th” → cat &amp; balloons → fish cursor → hint overlay → black fade transition.</li>
      <li>MAIN Scene: background &amp; grass → clouds → campus → cat &amp; lantern → stencil write → layered blackout (5 layers) → confetti → (if celebrating) fireworks particles → title overlays.</li>
    </ul>
    <h2 id="cover">3. Scene 1: Cover Design Details</h2>
    <p>The following figure provides the cover layout.</p>
    <ReportFigure folder="card" files={["Im2.png"]} caption="Figure 3 Cover scene layout placeholder." />
    <p>As shown in the figure 3, the cover background is implemented using a simple but festive visual effect — a soft yellow background combined with purple line-drawn stars. The overall color palette enhances the cheerful atmosphere of the celebration.</p>
    <h3>Elements</h3>
    <ul>
      <li>The triangular flags, balloons, and cat on the cover reuse the same drawing functions as those in the main scene.</li>
      <li>Each star is designed in a minimal but elegant way: it consists of four groups of main lines — one vertical line (longest), one horizontal line (medium), and two diagonal lines (slightly shorter).</li>
      <li>Using the dashRays() function, a set of dotted radial rays are drawn around each star to create a glowing effect. The stars are animated to change their size over time, creating a twinkling effect.</li>
    </ul>
    <h3>Title Text</h3>
    <p>At the bottom of the cover, the main title uses simple scaling to create a perspective effect—objects appear larger when closer. Each character (“2”, “0”, “T”, “H”, heart) is drawn as a pixel grid defined by strings of ’0’ and ’1’. To keep the pixel style while adding depth, lower pixel rows are scaled slightly wider than upper ones, forming an isosceles trapezoid that gives the title a sense of 3D feeling.</p>
    <h3>Cat Character</h3>
    <p>The function drawHero() draws a small cat whose head and body slowly grow and shrink to look like breathing. Its tail also moves left and right in a gentle swing. These movements are made using sine functions.</p>
    <ul>
      <li>breath controls the subtle scaling of the head and body.</li>
      <li>tailSwing controls the small oscillation of the tail’s angle.</li>
    </ul>
    <p>To further illustrate the cat’s animation and pose, the following pair of picture will display tow pose of cat.</p>
    <ReportFigure folder="card" files={["Im3.png","Im4.png"]} caption="Figure 4 Two frames for cat animation (placeholders)." labels={["(a) Breathing frame.","(b) Tail-swing frame."]} />
    <h3>Mouse Interaction</h3>
    <p>A fish-shaped cursor follows the mouse to make the cover more fun. When the fish gets close to the cat, the cat stops walking and looks at it. If the player moves the cursor away without clicking the left mouse button to “feed” the fish, the cat starts walking again, showing a simple chasing behavior.</p>
    <h2 id="campus">4. Scene 2: Campus and Soft Flashlight System</h2>
    <p>Before diving into the sky and object construction, the following figure sketches the main scene, and scene 2 is only a part of the campus area. The full view (Scene 3) appears gradually as the camera or viewport moves.</p>
    <ReportFigure folder="card" files={["Im5.png"]} caption="Figure 5 Main scene composition(without black screen." />
    <h3>Sky</h3>
    <p>Using the fixed-function OpenGL pipeline (without shaders or textures), the project creates a multi-section gradient sky that shows smooth color changes—from deep night blue to sky blue, golden yellow, warm orange, and red. The sky is drawn with a striped gradient: the visible height is divided into 80–160 thin horizontal strips, and each strip’s top and bottom colors come from a gradient function. This produces a soft layered look.</p>
    <p>Although the gradient could be made smoother, I kept a slight “pixel-striped” effect to fit the project’s overall pixel style.</p>
    <p>Small bright dots are added in the upper half of the screen, and their transparency changes gently over time to look like faint twinkling stars, helping the scene transition naturally into the darker stage.</p>
    <h3>Clouds</h3>
    <p>The cloud system is organized hierarchically, from the base function drawCloudBlob() to the higher-level drawCloudCluster(), allowing clouds to form naturally from small blobs into larger groups.</p>
    <ul>
      <li>Each cloud is composed of multiple semi-transparent ellipses stacked together, forming four layers: shadow, gray body, highlight, and a soft outer rim. Typically, one full cloud combines 3–4 small clusters.</li>
      <li>A flat-cut bottom greatly improves realism. This effect is achieved by drawing a rectangular “mask bar” to trim the lower edge and blend it smoothly with the sky color.</li>
      <li>Clouds of different sizes are arranged in several horizontal rows, creating a natural sense of depth and distance.</li>
    </ul>
    <p>The two images below show the effect of the flat-cut cloud base.</p>
    <ReportFigure folder="card" files={["Im6.png","Im7.png"]} caption="Figure 6 Cloud without flat-cut." labels={["(a) Cloud with flat-cut.","(b) Flat-cut base."]} />
    <h3>Triangular Flags</h3>
    <p>The flags are drawn in screen-space coordinates, and the projection is reset each frame so they stay at the top of the screen, like a decorative border of the card.</p>
    <p>To make the motion look more natural, each flag’s tip moves up and down using a sine function based on its x-position. Small semi-transparent white dots are added as highlights.</p>
    <ReportFigure folder="card" files={["Im8.png"]} caption="Figure 7 Triangular flags placeholder." />
    <h3>Balloons</h3>
    <p>Each balloon is made of a round body, a small darker triangular knot, a bright highlight, and a thin line as the string. The balloons float slowly over time, and their vertical movement changes slightly with x-position to make the motion less uniform. Three layouts are used—center, top edge (after camera moves), and sides—with lower density to keep buildings and text clear.</p>
    <h3>Buildings</h3>
    <p>The figure below shows the construction of the building section, which mainly includes the shadow, four main building parts, and the stone monument.</p>
    <ReportFigure folder="card" files={["Im9.png"]} caption="Figure 8 Buildings." />
    <ul>
      <li>Shadows: Reusable adjustable quadrilateral shadows are used under major structures; transparency and vertical stretch are parameterized.</li>
      <li><strong>Foundation Building</strong><br />Built from grouped rectangles divided into left, center, and right blocks, with small side wings referring to real photos. A layer of glass strips is added on top.</li>
      <li><strong>Library</strong><br />The library includes upper-left, upper-right, and lower parts. It mainly uses square shapes with semi-transparent gray rectangles to show glass. The base has several stacked gray rectangles in dark and light tones to create depth and steps.</li>
      <li><strong>S-Building</strong><br />This building uses reddish-brown blocks with grid lines showing the wall panels. The drawing order is: base color → grid lines → decoration → outer contour. Glass corridors connect the segments, and a main function combines several units into one continuous complex.</li>
      <li><strong>Gymnasium</strong><br />Similar to the S-building, the gym is made of two joined parts. Each part (drawGymUnitSimple()) uses a large rectangle with a horizontal color change to show the glass lower section and tinted upper body. Zigzag lines are used as simple wall decorations. The function drawGymnasiumSimple() scales and combines the two parts to form the whole gym.</li>
      <li><strong>Stone Monument and Nameplate</strong><br />A reusable stone monument system allows color and text changes. The main XJTLU monument (based on the Foundation Building plaza) is larger and more detailed, with blue outline text spelling the university name. On its left, a simplified shield emblem is drawn with vertical, horizontal, and diagonal lines, then outlined again with thicker strokes (the same method is used for the celebration title in Scene 3). Three small dots inside the shield mark the emblem details. Above the monument, small flags in XJTLU colors are displayed, and smaller blue plaques inspired by campus signs are placed in front of the buildings.</li>
    </ul>
    <h3>Grass and Trees</h3>
    <ul>
      <li><strong>Grass System</strong><br />A solid green base layer is drawn first, followed by dense triangular grass patches. Each patch uses three color tones—dark, mid, and bright—to represent shadow, midtone, and highlight.</li>
      <li>Tufts: 1–4 thin triangles form small grass clusters, placed with a high probability in each area.</li>
      <li>Clumps: Semi-transparent ellipses under the tufts create soft shadows and make the grass appear fuller. Using separate ellipses keeps the scene clean and avoids messy overlapping shadows.</li>
      <li><strong>Trees</strong><br />Trees use block shapes to match the pixel style. The canopy is made of stacked color blocks from light to dark for shading, and the trunk is a simple vertical rectangle.</li>
    </ul>
    <ReportFigure folder="card" files={["Im10.png"]} caption="Figure 9 Tuft and Clumps." />
    <h3>Dark Mask and Flashlight Effect</h3>
    <p>After all background elements are drawn, a semi-transparent black layer covers the whole scene.</p>
    <p>The stencil buffer is divided into circular zones centered on the flashlight: the outermost area is 0, the rings are 1–4, and the bright center is 5. During rendering, the program draws full-screen black rectangles for each zone, setting different alpha values: darkest outside, lighter toward the center, and none in the middle. This forms a smooth light gradient with soft edges and a bright focus at the center.</p>
    <ReportFigure folder="card" files={["Im11.png"]} caption="Figure 10 Five-ring stencil flashlight (placeholder)." />
    <h2 id="fireworks">5. Scene 3: Fireworks and Celebration</h2>
    <p>The following picture stands for the overall celebration scene.</p>
    <ReportFigure folder="card" files={["Im12.png"]} caption="Figure 11 Celebration scene." />
    <h3>Fireworks System</h3>
    <ul>
      <li>Each firework has three stages: launch, burst, and fade, all controlled by a particle system to create dynamic effects.</li>
      <li>launchRocket() creates and moves rockets upward to random heights defined by spawnFireworkBurst(), ensuring explosions occur in the upper half of the screen.</li>
      <li>While rising, emitTrail(const Rocket&amp; rk) generates short-lived trail particles with bright colors from the FW_COLS palette, forming flickering light dots along the rocket’s path.</li>
      <li>At the target height, emitBurst(cx, cy, n) produces an explosion by spreading 𝑛 particles evenly in a circle, each with random velocity, lifetime, and color, with white particles at the center for stronger flashes.</li>
      <li>All particles are stored in the global list gParticles and updated each frame by updateParticles(float dt). Particles fade out gradually as their lifetime reaches zero.</li>
    </ul>
    <h2 id="text">6. Text and Hint System</h2>
    <p>The text display system has two layers:</p>
    <ul>
      <li>A hint layer for user prompts.</li>
      <li>A celebration title layer for festive text.</li>
    </ul>
    <ReportFigure folder="card" files={["Im13.jpg"]} caption="Figure 12 Text system." />
    <h3>Interactive Hint Texts</h3>
    <ul>
      <li>bitmapTextWidth() calculates the pixel width of a string so that drawHintTopCenter() can center it on the screen. The function also supports vertical offset for positioning. Together, they draw normal on-screen hints.</li>
      <li>drawThankBubbleAboveHero() displays a floating speech bubble above the main character (e.g., showing “Thank you.”). The bubble moves slightly up and down using sin(gTime) to create a lively animation.</li>
    </ul>
    <h3>Celebration Title Texts</h3>
    <ul>
      <li>drawStrokeOutlinedLineCentered_simple() draws celebration slogans with two layers—an outline and inner text—for a clean, bold look. Then drawCelebrationBanner() combines two such lines into a complete banner.</li>
    </ul>
    <h2 id="limits">7. Limitations and Improvements</h2>
    <ul>
      <li><strong>Inconsistent naming and redundant functions</strong><br />Some parts of the code contain repeated logic or unclear naming. For example, the main character was initially a human, so many related functions use the prefix hero. After changing the character to a cat, the old naming remained, causing confusion and reducing readability.</li>
      <li><strong>Code structure too heavy</strong><br />The overall code can be simplified. Several initialization or setup functions duplicate similar tasks and could be merged or refactored to improve clarity and maintainability.</li>
      <li><strong>Lack of window-size adaptability</strong><br />Some rendering methods do not adjust properly to window resizing. When the viewport is reduced, certain buildings or objects may overlap or move out of frame. Future improvements should include adaptive scaling or coordinate normalization to maintain visual consistency across different resolutions.</li>
    </ul>
  </>
}
