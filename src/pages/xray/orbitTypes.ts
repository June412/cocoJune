export type Region = 'whole' | 'torso' | 'legs'
export type OrbitView = { yaw: number; pitch: number; region: Region; opacity: number }
export type DrawFrame = (view: OrbitView, moving: boolean, current: () => boolean) => void | Promise<void>

// A fresh canvas is required when falling back from WebGL to 2D.
export type MakeRenderer = (canvas: HTMLCanvasElement, software: boolean) => DrawFrame
