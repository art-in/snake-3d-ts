import Apple from './Apple';
import Cube from './Cube';
import Grid from './Grid';
import Snake from './Snake';

export default class Scene {
  canvas: HTMLCanvasElement | undefined;
  ctx: WebGLRenderingContext | undefined;

  program?: WebGLProgram;
  matrixLocation?: WebGLUniformLocation | null;

  cubeTextures?: WebGLTexture[];

  fieldOfViewRadians: number | undefined;
  modelXRotationRadians: number | undefined;
  modelYRotationRadians: number | undefined;

  isDragging?: boolean;
  clientX?: number;
  clientY?: number;

  grid = new Grid();
  snake = new Snake();
  apples: Apple[] = [];

  cube = new Cube();

  needsRedraw = true;
}
